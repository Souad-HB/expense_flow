import React from "react";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalculateIcon from "@mui/icons-material/Calculate";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

// Define Sidebar Props
interface SidebarProps {
  pageContent: import("c:/Users/souad/bootcamp/Projects/expense_flow/node_modules/@types/react/index").ReactNode;
}

const NAVIGATION: Navigation = [
  { segment: "/dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "/spending", title: "Spending", icon: <ShoppingCartIcon /> },
  { segment: "/budget", title: "Budget", icon: <CalculateIcon /> },
  { segment: "/accounts", title: "Accounts", icon: <AccountBalanceWalletIcon /> },
  { segment: "/transactions", title: "Transactions", icon: <ReceiptIcon /> },
];

const demoTheme = extendTheme({
  colorSchemes: {
    light: { palette: { primary: { main: "#f44336" } } },
    dark: { palette: { primary: { main: "#f44336" } } },
  },
});

export default function Sidebar({ pageContent }: SidebarProps) {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="/assets/HbLogo.jpg" />,
        title: "The HBs",
      }}
      theme={demoTheme}
    >
      <DashboardLayout>
        <PageContainer>
          {pageContent}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
