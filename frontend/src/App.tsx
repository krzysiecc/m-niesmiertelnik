
import MobileView from "./components/MobileView";
import { LenisProvider } from "./context/LenisContext";

export default function App() {
  return (
    <LenisProvider>
      <main>
        {/* <Layout> */}
          <MobileView />
        {/* </Layout> */}
      </main>
    </LenisProvider>
  );
}
