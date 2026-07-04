import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./components/providers/query-provider.tsx";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import AndroidBackButtonHandler from "./components/providers/android-back-button-handler.tsx";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
    <BrowserRouter>
      <AndroidBackButtonHandler>
        <ThemeProvider>
          <QueryProvider>
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <AppRoutes />
              </div>
              <Toaster />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </AndroidBackButtonHandler>
    </BrowserRouter>
  );
}

export default App;
