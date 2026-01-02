export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'customer' | 'delivery_partner' | 'store_operator' | 'admin';
export type StoreType = 'partner_store' | 'dark_store' | 'micro_fulfillment';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_delivery';

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          role: UserRole;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          street_address: string;
          apartment: string | null;
          city: string;
          state: string;
          zip_code: string;
          latitude: number | null;
          longitude: number | null;
          delivery_instructions: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          street_address: string;
          apartment?: string | null;
          city: string;
          state: string;
          zip_code: string;
          latitude?: number | null;
          longitude?: number | null;
          delivery_instructions?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          street_address?: string;
          apartment?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          latitude?: number | null;
          longitude?: number | null;
          delivery_instructions?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          type: StoreType;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude: number;
          longitude: number;
          delivery_radius_miles: number;
          is_active: boolean;
          opens_at: string;
          closes_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: StoreType;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude: number;
          longitude: number;
          delivery_radius_miles?: number;
          is_active?: boolean;
          opens_at?: string;
          closes_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: StoreType;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          latitude?: number;
          longitude?: number;
          delivery_radius_miles?: number;
          is_active?: boolean;
          opens_at?: string;
          closes_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          images: Json;
          base_price: number;
          unit: string;
          is_taxable: boolean;
          tax_category: string;
          barcode: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          images?: Json;
          base_price: number;
          unit?: string;
          is_taxable?: boolean;
          tax_category?: string;
          barcode?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          images?: Json;
          base_price?: number;
          unit?: string;
          is_taxable?: boolean;
          tax_category?: string;
          barcode?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          store_id: string;
          quantity: number;
          reserved_quantity: number;
          reorder_level: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          store_id: string;
          quantity?: number;
          reserved_quantity?: number;
          reorder_level?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          store_id?: string;
          quantity?: number;
          reserved_quantity?: number;
          reorder_level?: number;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          store_id: string | null;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_id?: string | null;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_id?: string | null;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          store_id: string;
          address_id: string;
          status: OrderStatus;
          subtotal: number;
          tax_amount: number;
          delivery_fee: number;
          tip_amount: number;
          total_amount: number;
          estimated_delivery_time: string | null;
          actual_delivery_time: string | null;
          special_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          store_id: string;
          address_id: string;
          status?: OrderStatus;
          subtotal: number;
          tax_amount?: number;
          delivery_fee?: number;
          tip_amount?: number;
          total_amount: number;
          estimated_delivery_time?: string | null;
          actual_delivery_time?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          store_id?: string;
          address_id?: string;
          status?: OrderStatus;
          subtotal?: number;
          tax_amount?: number;
          delivery_fee?: number;
          tip_amount?: number;
          total_amount?: number;
          estimated_delivery_time?: string | null;
          actual_delivery_time?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          tax_amount: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          tax_amount?: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          tax_amount?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          stripe_payment_intent_id: string | null;
          amount: number;
          status: PaymentStatus;
          payment_method: string | null;
          refund_amount: number;
          failure_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          stripe_payment_intent_id?: string | null;
          amount: number;
          status?: PaymentStatus;
          payment_method?: string | null;
          refund_amount?: number;
          failure_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          stripe_payment_intent_id?: string | null;
          amount?: number;
          status?: PaymentStatus;
          payment_method?: string | null;
          refund_amount?: number;
          failure_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivery_partners: {
        Row: {
          id: string;
          user_id: string;
          vehicle_type: string | null;
          license_number: string | null;
          is_available: boolean;
          current_latitude: number | null;
          current_longitude: number | null;
          rating: number;
          total_deliveries: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_type?: string | null;
          license_number?: string | null;
          is_available?: boolean;
          current_latitude?: number | null;
          current_longitude?: number | null;
          rating?: number;
          total_deliveries?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_type?: string | null;
          license_number?: string | null;
          is_available?: boolean;
          current_latitude?: number | null;
          current_longitude?: number | null;
          rating?: number;
          total_deliveries?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          order_id: string;
          delivery_partner_id: string | null;
          status: DeliveryStatus;
          pickup_time: string | null;
          delivery_time: string | null;
          current_latitude: number | null;
          current_longitude: number | null;
          distance_miles: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          delivery_partner_id?: string | null;
          status?: DeliveryStatus;
          pickup_time?: string | null;
          delivery_time?: string | null;
          current_latitude?: number | null;
          current_longitude?: number | null;
          distance_miles?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          delivery_partner_id?: string | null;
          status?: DeliveryStatus;
          pickup_time?: string | null;
          delivery_time?: string | null;
          current_latitude?: number | null;
          current_longitude?: number | null;
          distance_miles?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: DiscountType;
          discount_value: number;
          min_order_amount: number;
          max_discount_amount: number | null;
          valid_from: string;
          valid_until: string;
          usage_limit: number | null;
          usage_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: DiscountType;
          discount_value: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          valid_from: string;
          valid_until: string;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          discount_type?: DiscountType;
          discount_value?: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          valid_from?: string;
          valid_until?: string;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type?: string;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: string;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      store_type: StoreType;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      delivery_status: DeliveryStatus;
      discount_type: DiscountType;
    };
  };
}
