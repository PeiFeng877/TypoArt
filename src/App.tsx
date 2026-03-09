import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { Canvas } from './components/Canvas';
import { SidebarRight } from './components/SidebarRight';
import './index.css';

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <SidebarLeft />
        <Canvas />
        <SidebarRight />
      </div>
    </div>
  );
}
