import * as React from "react";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalculateIcon from "@mui/icons-material/Calculate";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Home } from "./Home";
import { Transactions } from "./Transactions";

const NAVIGATION: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "spending",
    title: "Spending",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "Budget",
    title: "Budget",
    icon: <CalculateIcon />,
  },
  {
    segment: "Accounts",
    title: "Account",
    icon: <AccountBalanceWalletIcon />,
  },
  {
    segment: "Transactions",
    title: "Transactions",
    icon: <ReceiptIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#f44336",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#f44336",
        },
      },
    },
  },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function Sidebar() {
  const router = useDemoRouter("/dashboard");

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src="/assets/HbLogo.jpg" />,
        title: "The HBs",
      }}
      theme={demoTheme}
    >
      <DashboardLayout>
        <PageContainer>
          {/* components for dashboard, spending, budget, account, and transactions go here */}
          {router.pathname === "/dashboard" && <Home />}
          {router.pathname === "/spending" && <Transactions />}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
