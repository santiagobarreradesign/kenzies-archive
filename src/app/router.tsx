import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteChrome } from '../components/layout/SiteChrome'
import { AlignmentMatrix } from '../pages/AlignmentMatrix'
import { Army } from '../pages/Army'
import { Commander } from '../pages/Commander'
import { Headquarters } from '../pages/Headquarters'
import { Recruit } from '../pages/Recruit'
import { RecruitDossier } from '../pages/RecruitDossier'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteChrome />}>
          <Route path="/" element={<Headquarters />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/recruit/:id" element={<RecruitDossier />} />
          <Route path="/army" element={<Army />} />
          <Route path="/commander" element={<Commander />} />
          <Route path="/dev/matrix" element={<AlignmentMatrix />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
