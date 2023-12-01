function getDeliveryStatusBadgecolor(status) {
  switch (status) {
    case 'CREATED': return 'light'
    case 'DELIVERY AGENT ASSIGNED': return 'dark'
    case 'AGENT ASSIGNED': return 'dark'
    case 'OUT FOR DELIVERY': return 'info'
    case 'DELIVERED': return 'success'
    case 'NOT DELIVERED': return 'danger'
  }
}

export {getDeliveryStatusBadgecolor}
