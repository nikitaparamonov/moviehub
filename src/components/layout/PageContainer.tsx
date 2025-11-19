import React from 'react'

const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>{children}</div>
}

export default PageContainer
