
import Home from "./components/Home";
import { LenisProvider } from "./context/LenisContext";

export default function App() {
  return (
    <LenisProvider>
      <main>
        {/* <Layout> */}
          <Home />
        {/* </Layout> */}
      </main>
    </LenisProvider>
  );
}
