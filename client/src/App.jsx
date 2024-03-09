import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import { RouterProvider } from 'react-router-dom';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { router } from './routes';
import axios from 'axios';
import { createContext, useCallback, useState } from 'react';

export const ChatDataContext = createContext(null);
const App = () => {
  const { setError } = useApiErrorBoundary();
  const [ssebowaData, setSSbowaData] = useState([]);

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error?.response?.status === 401) {
          setError(error);
        }
      },
    }),
  });
  const submitChatMessage = useCallback(async (data) => {
    setSSbowaData((prevData) => [...prevData, { sentByUser: true, text: data }]);
    const formData = new FormData();
    formData.append('prompt', data);
    const response = await axios.post('https://api5.ssebowa.chat/ssebowavlm', formData, {
      headers: {
        'API-KEY': 'ssebowa_3a4b8f7c2e1d6a9b5d8c3e2f1a7b6e9',
      },
    });
    setSSbowaData((prevData) => [...prevData, { sentByUser: false, text: response?.data }]);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider>
          <RadixToast.Provider>
            <ChatDataContext.Provider value={{ submitChatMessage, ssebowaData }}>
              <ToastProvider>
                <DndProvider backend={HTML5Backend}>
                  <RouterProvider router={router} />
                  <ReactQueryDevtools initialIsOpen={false} position="top-right" />
                  <Toast />
                  <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
                </DndProvider>
              </ToastProvider>
            </ChatDataContext.Provider>
          </RadixToast.Provider>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default () => (
  <ScreenshotProvider>
    <App />
  </ScreenshotProvider>
);
