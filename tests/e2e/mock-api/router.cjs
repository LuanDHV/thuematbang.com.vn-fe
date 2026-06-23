const handleSystemRoutes = require("./routes/system.cjs");
const handleAuthRoutes = require("./routes/auth.cjs");
const handleLocationsRoutes = require("./routes/locations.cjs");
const handleCategoryRoutes = require("./routes/categories.cjs");
const handleNewsRoutes = require("./routes/news.cjs");
const handleBannerRoutes = require("./routes/banners.cjs");
const handleAdminRoutes = require("./routes/admin.cjs");
const handleContentRoutes = require("./routes/content.cjs");
const handleSearchRoutes = require("./routes/search.cjs");
const handleFaqRoutes = require("./routes/faqs.cjs");
const handleSeoContentRoutes = require("./routes/seo-contents.cjs");
const handleListingsRoutes = require("./routes/listings.cjs");
const handleMediaRoutes = require("./routes/media.cjs");

const routeHandlers = [
  handleSystemRoutes,
  handleAuthRoutes,
  handleLocationsRoutes,
  handleCategoryRoutes,
  handleNewsRoutes,
  handleBannerRoutes,
  handleAdminRoutes,
  handleContentRoutes,
  handleSearchRoutes,
  handleFaqRoutes,
  handleSeoContentRoutes,
  handleListingsRoutes,
  handleMediaRoutes,
];

async function dispatchRequest(context) {
  for (const handler of routeHandlers) {
    if (await handler(context)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  dispatchRequest,
};
