import React from 'react'
// Components
import Navbar from './Navbar'
import Sidebar from './Sidebar'
// Ui-components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const Layout = ({ children }) => {
  return (
    <>
      <div className='hidden md:block'>
        <Sidebar />
      </div>
      <Navbar />
      <div className='md:ml-32 p-10'>
        {children}
      </div>
      <div className='block md:hidden'>
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  )
}

export default Layout
