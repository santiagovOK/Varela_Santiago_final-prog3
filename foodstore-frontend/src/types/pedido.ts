// TPI : Creación de la interfaz pedido.ts para analizar directamente la devolución de datos de los DTOs relacionados desde el backend.

export interface DetallePedidoDto {
  id: number;
  cantidad: number;
  subtotal: number;
  nombreProducto: string;
}

export interface PedidoDto {
  id: number;
  fecha: string;
  estado: string; // PENDIENTE, PREPARACION, ENVIADO, ENTREGADO
  total: number;
  formaPago: string; // EFECTIVO, MERCADO_PAGO, TRANSFERENCIA, TARJETA
  detalles: DetallePedidoDto[];
}
