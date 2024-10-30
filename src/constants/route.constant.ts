const privateAdminPath = "/admin";
const privateSellerPath = "/seller";

export const adminRoutes = {
  DASHBOARD: `${privateAdminPath}/dashboard`,
  VENDORS: `${privateAdminPath}/vendors`,
  ORDERS: `${privateAdminPath}/vendor-orders`,
  APPROVAL: `${privateAdminPath}/vendor-approval`,
  TRANSACTION: `${privateAdminPath}/transaction`,
};

export const sellerRoutes = {
  DASHBOARD: `${privateSellerPath}/`,
  PRODUCTS: `${privateSellerPath}/products`,
  ORDERS: `${privateSellerPath}/orders`,
  PROFILE: `${privateSellerPath}/profile`,
  PRODUCT_DETAIL: `${privateSellerPath}/products/`,
};

export const publicRoutes = {
  HOME: "/",
  AUTH: "/auth",
};
