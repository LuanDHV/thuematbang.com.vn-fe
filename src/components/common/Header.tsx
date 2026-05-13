import { HeaderClient } from "../client/HeaderClient";

const HEADER_MENU_ITEMS = [
  { id: 1, name: "Cho Thuê", slug: "cho-thue" },
  { id: 2, name: "Cần Thuê", slug: "can-thue" },
  { id: 3, name: "Dự Án", slug: "du-an" },
  { id: 4, name: "Tin Tức", slug: "tin-tuc" },
];

export default async function Header() {
  return <HeaderClient categories={HEADER_MENU_ITEMS} />;
}
