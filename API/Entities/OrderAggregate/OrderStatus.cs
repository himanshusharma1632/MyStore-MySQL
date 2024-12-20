namespace API.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        isPending,
        isDelievered,
        isOrderPlaced,
        isPaymentReceived,
        isOrderShipped,
        isOrderCancelled,
        isPaymentFailed
    }
}