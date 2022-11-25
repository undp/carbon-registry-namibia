import React from 'react';
import CustomLayout from '../../Components/Layout/layout';
import UserManagement from './userManagement';

const UserManagementLayout = () => {
  return (
    <div>
      <CustomLayout title="User Management" selectedKey="userManagement">
        <UserManagement />
      </CustomLayout>
    </div>
  );
};

export default UserManagementLayout;
