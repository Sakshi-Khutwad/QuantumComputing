import { ClassicalPanel } from './components/classical/ClassicalPanel'
import { ComparisonDock } from './components/compare/ComparisonDock'
import { TileInspectorDrawer } from './components/explain/TileInspectorDrawer'
import { QuantumPanel } from './components/quantum/QuantumPanel'
import { ProcessingTimeline } from './components/shared/ProcessingTimeline'
import { QuantumBackground } from './components/shared/QuantumBackground'
import { HeaderBar } from './layout/HeaderBar'
import { MainSplitLayout } from './layout/MainSplitLayout'
import { usePipelineStore } from './store/usePipelineStore'

function App() {
  const selectedTile = usePipelineStore((state) => state.selectedTile)

  return (
    <div className="app-root">
      <QuantumBackground />
      <div className="app-content">
        <HeaderBar />
        <ProcessingTimeline />
        <MainSplitLayout
          left={<QuantumPanel />}
          right={<ClassicalPanel />}
          bottomDock={<ComparisonDock />}
        />
      </div>
      {selectedTile && <TileInspectorDrawer />}
    </div>
  )
}

export default App
