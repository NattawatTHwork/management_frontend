import React, { ReactNode } from 'react'
import SidebarWithHeader from './SidebarWithHeader'
import SmallWithLogoLeft from './SmallWithLogoLeft'

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <SidebarWithHeader>
            {children}
            </SidebarWithHeader>
            <SmallWithLogoLeft />
        </>
    )
}

export default Layout