export const usersFn = (
  adminRoles,
  administratorRoles,
  managerRoles,
  recipientRoles,
  examinerRoles,
  warehouseStaffRoles,
  customerRoles,
) => {
  // map customer array 100 items
  // const customers = Array.from({ length: 100 }, (_, i) => ({
  //   name: `Customer ${i + 1}`,
  //   email: `customer${i + 1}@booking.com`,
  //   password: 'Customer@123',
  //   role: customerRoles.length > 0 ? customerRoles[0]._id.toString() : null,
  // }));
  return [
    {
      name: 'System Administrator',
      email: 'administrator@booking.com',
      password: 'Admin@123',
      role:
        administratorRoles.length > 0
          ? administratorRoles[0]._id.toString()
          : null,
    },
    // admin user
    {
      name: 'Admin User',
      email: 'admin@booking.com',
      password: 'Admin@123',
      role: adminRoles.length > 0 ? adminRoles[0]._id.toString() : null,
    },
    {
      name: 'Manager User',
      email: 'manager@booking.com',
      password: 'Manager@123',
      role: managerRoles.length > 0 ? managerRoles[0]._id.toString() : null,
    },
    {
      name: 'Recipient User',
      email: 'recipient@booking.com',
      password: 'Recipient@123',
      role: recipientRoles.length > 0 ? recipientRoles[0]._id.toString() : null,
    },
    {
      name: 'Examiner User',
      email: 'examiner@booking.com',
      password: 'Examiner@123',
      role: examinerRoles.length > 0 ? examinerRoles[0]._id.toString() : null,
    },
    {
      name: 'Warehouse Staff User',
      email: 'warehouse-staff@booking.com',
      password: 'Warehouse@123',
      role:
        warehouseStaffRoles.length > 0
          ? warehouseStaffRoles[0]._id.toString()
          : null,
    },
    {
      name: 'Demo Customer',
      email: 'customer@booking.com',
      password: 'Customer@123',
      role: customerRoles.length > 0 ? customerRoles[0]._id.toString() : null,
    },
    //...customers,
  ];
};
