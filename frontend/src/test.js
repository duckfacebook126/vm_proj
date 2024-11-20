const DashboardLayoutBranding = () => {
  const NAVIGATION = [
      {
          segment: 'virtualmachines',
          title: 'Virtual Machines',
          icon: <DashboardIcon />,
      },
      {
          segment: 'disks',
          title: 'Disks',
          icon: <ShoppingCartIcon />,
      },
      {
          segment: 'analytics',
          title: 'Analytics',
          icon: <ShoppingCartIcon />,

      }
  ];

  const demoTheme = createTheme({
      cssVariables: {
          colorSchemeSelector: 'data-toolpad-color-scheme',
      },
      colorSchemes: { light: true, dark: true },
      breakpoints: {
          values: {
              xs: 0,
              sm: 600,
              md: 600,
              lg: 1200,
              xl: 1536,
          },
      },
  });

  function DemoPageContent({ pathname }) {
      if (pathname === '/virtualmachines') {
          return (
              <div className="vm-cards">
                  {viewMode === 'card' && renderVMCards()}
                  {viewMode === 'table' && renderVMTable()}
                  <IconButton style={{ height: '50px', width: '50px' }} className="btn-add-vm" onClick={() => setShowForm(true)}>
                      <AddIcon style={{ height: '50px', width: '50px' }} />
                  </IconButton>
              </div>
          );
      } else if (pathname === '/disks') {
          return (
              <div className="vm-cards">
                  {viewMode === 'card' && renderDiskCards()}
                  {viewMode === 'table' && renderDiskTable()}
              </div>
          );
      }
  }

  DemoPageContent.propTypes = {
      pathname: PropTypes.string.isRequired,
  };

  const router = useDemoRouter('virtualmachines');

  return (
      <AppProvider
          navigation={NAVIGATION}
          branding={{
              logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
              title: 'MUI',
          }}
          router={router}
          theme={demoTheme}
      >
          <DashboardLayout>
              <div className="header-buttons">
                  <Button variant='contained' className="btn-logout" onClick={handleLogout}>Logout</Button>
                  <Button variant='contained' onClick={() => setViewMode('card')}>Card View</Button>
                  <Button variant='contained' onClick={() => setViewMode('table')}>Table View</Button>
              </div>
              <DemoPageContent pathname={router.pathname} />
          </DashboardLayout>
      </AppProvider>
  );
};