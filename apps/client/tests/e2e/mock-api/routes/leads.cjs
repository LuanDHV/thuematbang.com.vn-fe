module.exports = async function handleLeadsRoutes(context) {
  const {
    req,
    requestUrl,
    origin,
    state,
    clone,
    sendJson,
    envelope,
    buildPageResponse,
    getCurrentUserFromRequest,
    parseBody,
  } = context;

  // ── Leads ──────────────────────────────────────
  if (requestUrl.pathname === "/api/v1/leads" && req.method === "GET") {
    const items = state.leads.map(enrichLead);
    sendJson(context.res, 200, buildPageResponse(items, requestUrl), origin);
    return true;
  }

  const leadMatch = requestUrl.pathname.match(/^\/api\/v1\/leads\/(\d+)$/);
  if (leadMatch) {
    const id = Number(leadMatch[1]);
    const lead = state.leads.find((l) => l.id === id);
    if (!lead) {
      sendJson(context.res, 404, { message: "Lead not found" }, origin);
      return true;
    }

    if (req.method === "GET") {
      sendJson(context.res, 200, envelope(enrichLead(lead)), origin);
      return true;
    }

    if (req.method === "PATCH") {
      const body = await parseBody(req);
      Object.assign(lead, body);
      lead.updatedAt = new Date().toISOString();
      sendJson(context.res, 200, envelope(enrichLead(lead)), origin);
      return true;
    }

    if (req.method === "DELETE") {
      const idx = state.leads.findIndex((l) => l.id === id);
      if (idx === -1) {
        sendJson(context.res, 404, { message: "Lead not found" }, origin);
        return true;
      }
      state.leads.splice(idx, 1);
      state.listingMatches = (state.listingMatches || []).filter(
        (m) => m.leadId !== id,
      );
      sendJson(context.res, 200, { data: { success: true } }, origin);
      return true;
    }
  }

  // ── Listing Matches ────────────────────────────
  const byLeadMatch = requestUrl.pathname.match(
    /^\/api\/v1\/listing-matches\/by-lead\/(\d+)$/,
  );
  if (byLeadMatch && req.method === "GET") {
    const leadId = Number(byLeadMatch[1]);
    const matches = (state.listingMatches || []).filter(
      (m) => m.leadId === leadId,
    );
    sendJson(
      context.res,
      200,
      { data: matches.map(enrichListingMatch) },
      origin,
    );
    return true;
  }

  const matchAction = requestUrl.pathname.match(
    /^\/api\/v1\/listing-matches\/(\d+)\/(promote|reject|unmatch)$/,
  );
  if (matchAction && req.method === "POST") {
    const id = Number(matchAction[1]);
    const action = matchAction[2];
    const match = (state.listingMatches || []).find((m) => m.id === id);

    if (!match) {
      sendJson(context.res, 404, { message: "Listing match not found" }, origin);
      return true;
    }

    if (action === "promote") {
      if (match.status !== "CANDIDATE") {
        sendJson(
          context.res,
          400,
          { message: "Only CANDIDATE matches can be promoted" },
          origin,
        );
        return true;
      }
      const now = new Date().toISOString();
      match.status = "MATCHED";
      match.matchedAt = now;
      // Update snapshots on property
      const property = state.properties.find((p) => p.id === match.propertyId);
      if (property) {
        property.isMatched = true;
        property.currentMatchId = id;
        property.matchedLeadId = match.leadId;
        property.matchedAt = now;
      }
      // Update snapshots on rentRequest
      const rentRequest = state.rentRequests.find(
        (r) => r.id === match.rentRequestId,
      );
      if (rentRequest) {
        rentRequest.isMatched = true;
        rentRequest.currentMatchId = id;
        rentRequest.matchedLeadId = match.leadId;
        rentRequest.matchedAt = now;
      }
      // Update lead status
      const lead = state.leads.find((l) => l.id === match.leadId);
      if (lead) lead.status = "QUALIFIED";
    } else if (action === "reject") {
      if (match.status !== "CANDIDATE") {
        sendJson(
          context.res,
          400,
          { message: "Only CANDIDATE matches can be rejected" },
          origin,
        );
        return true;
      }
      match.status = "REJECTED";
    } else if (action === "unmatch") {
      if (match.status !== "MATCHED") {
        sendJson(
          context.res,
          400,
          { message: "Only MATCHED matches can be unmatched" },
          origin,
        );
        return true;
      }
      const now = new Date().toISOString();
      match.status = "CANDIDATE";
      match.matchedAt = null;
      // Clear snapshots
      const property = state.properties.find((p) => p.id === match.propertyId);
      if (property) {
        property.isMatched = false;
        property.currentMatchId = null;
        property.matchedLeadId = null;
        property.matchedAt = null;
      }
      const rentRequest = state.rentRequests.find(
        (r) => r.id === match.rentRequestId,
      );
      if (rentRequest) {
        rentRequest.isMatched = false;
        rentRequest.currentMatchId = null;
        rentRequest.matchedLeadId = null;
        rentRequest.matchedAt = null;
      }
      const lead = state.leads.find((l) => l.id === match.leadId);
      if (lead) lead.status = "CONTACTED";
    }

    sendJson(context.res, 200, envelope(clone(match)), origin);
    return true;
  }

  const matchDelete = requestUrl.pathname.match(
    /^\/api\/v1\/listing-matches\/(\d+)$/,
  );
  if (matchDelete && req.method === "DELETE") {
    const id = Number(matchDelete[1]);
    const idx = (state.listingMatches || []).findIndex((m) => m.id === id);
    if (idx === -1) {
      sendJson(context.res, 404, { message: "Listing match not found" }, origin);
      return true;
    }
    const match = state.listingMatches[idx];
    if (match.status === "MATCHED") {
      sendJson(
        context.res,
        400,
        { message: "Cannot delete a MATCHED listing match. Unmatch first." },
        origin,
      );
      return true;
    }
    state.listingMatches.splice(idx, 1);
    sendJson(context.res, 200, { data: { success: true } }, origin);
    return true;
  }

  return false;
};

// ── Helpers ──────────────────────────────────────

function enrichLead(lead) {
  const property = lead.propertyId
    ? { id: lead.propertyId, title: "Mặt bằng Quận 1", slug: "mat-bang-quan-1" }
    : null;
  const rentRequest = lead.rentRequestId
    ? {
        id: lead.rentRequestId,
        title: "Cần thuê căn hộ Quận 1",
        slug: "can-thue-can-ho-quan-1",
      }
    : null;

  return {
    ...lead,
    property,
    rentRequest,
    listingMatches: [],
  };
}

function enrichListingMatch(match) {
  const property = { id: match.propertyId, title: "Mặt bằng Quận 1", slug: "mat-bang-quan-1", contactName: "Nguyễn Văn A", contactPhone: "0901234567" };
  const rentRequest = { id: match.rentRequestId, title: "Cần thuê căn hộ Quận 1", slug: "can-thue-can-ho-quan-1", contactName: "Nguyễn Văn B", contactPhone: "0907654321" };
  return { ...match, property, rentRequest };
}
