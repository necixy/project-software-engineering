export enum statusType {
  requested = 'requested',
  accepted = 'accepted',
  completed = 'completed',
  canceled = 'canceled',
  paymentPending = 'payment-pending',
}

export enum filterChildKeys {
  proUserUId_status = 'proUserUId_status',
  clientUserUId_status = 'clientUserUId_status',
  proUserUId = 'proUserUId',
  clientUserUId = 'clientUserUId',
  proUserId = 'proUserId',
}
