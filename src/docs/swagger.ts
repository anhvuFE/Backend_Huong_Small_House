import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/env';

type Schema = Record<string, unknown>;

type ResponseFactory = (description: string, schema?: Schema) => Record<string, unknown>;

const wrapData = (schema?: Schema): Schema => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    ...(schema ? { data: schema } : { message: { type: 'string' } })
  }
});

const successResponse: ResponseFactory = (description, schema) => ({
  description,
  content: {
    'application/json': {
      schema: schema ? wrapData(schema) : wrapData()
    }
  }
});

const errorResponse: ResponseFactory = (description) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' }
        }
      }
    }
  }
});

const noContentResponse = (description: string): Record<string, unknown> => ({ description });

const serverUrl = env.nodeEnv === 'production' ? 'https://smallhouse.vn/api' : `http://localhost:${env.port}/api`;

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Small House API',
    version: '1.0.0',
    description:
      'REST API cho hệ thống Small House. Bao gồm khách vãng lai, khách hàng đăng nhập và quản trị viên.'
  },
  servers: [{ url: serverUrl }],
  tags: [
    { name: 'Auth', description: 'Đăng ký / đăng nhập / refresh token' },
    { name: 'Products', description: 'Danh mục & sản phẩm' },
    { name: 'Orders', description: 'Đặt hàng & thanh toán' },
    { name: 'Promotions', description: 'Mã khuyến mãi' },
    { name: 'Reviews', description: 'Đánh giá sản phẩm' },
    { name: 'Reports', description: 'Báo cáo quản trị' },
    { name: 'Feedback', description: 'Phản hồi của người dùng' },
    { name: 'Consultations', description: 'Tư vấn, trao đổi giữa khách và admin' },
    { name: 'Users', description: 'Quản lý người dùng (admin)' },
    { name: 'Profile', description: 'Thông tin cá nhân người dùng' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' }
        }
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } }
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['email', 'token', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          token: { type: 'string' },
          password: { type: 'string', minLength: 6 }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              userId: { type: 'integer' },
              email: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string' },
              status: { type: 'string', enum: ['active', 'locked'] }
            }
          },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' }
        }
      },
      ProductRequest: {
        type: 'object',
        required: ['name', 'brand', 'categoryId', 'price'],
        properties: {
          name: { type: 'string' },
          brand: { type: 'string' },
          categoryId: { type: 'integer' },
          description: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: { url: { type: 'string' }, alt: { type: 'string' } }
            }
          }
        }
      },
      Product: {
        allOf: [
          { $ref: '#/components/schemas/ProductRequest' },
          {
            type: 'object',
            properties: {
              productId: { type: 'integer' }
            }
          }
        ]
      },
      Category: {
        type: 'object',
        properties: {
          categoryId: { type: 'integer' },
          name: { type: 'string' },
          slug: { type: 'string' }
        }
      },
      CategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' }
        }
      },
      OrderItemInput: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer', minimum: 1 }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          name: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'integer' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          orderId: { type: 'integer' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          total: { type: 'number' },
          paymentMethod: { type: 'string', enum: ['COD', 'Sepay', 'Bank'] },
          paymentStatus: { type: 'string', enum: ['pending', 'paid'] },
          status: { type: 'string', enum: ['pending', 'confirmed', 'delivered'] },
          email: { type: 'string' },
          note: { type: 'string' }
        }
      },
      GuestInfo: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['email', 'items', 'paymentMethod'],
        properties: {
          email: { type: 'string', format: 'email' },
          guest: { $ref: '#/components/schemas/GuestInfo' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItemInput' } },
          paymentMethod: { type: 'string', enum: ['COD', 'Sepay', 'Bank'] },
          note: { type: 'string' },
          promotionCode: { type: 'string' }
        }
      },
      CreateOrderResponse: {
        type: 'object',
        properties: {
          order: { $ref: '#/components/schemas/Order' },
          checkoutUrl: { type: 'string', nullable: true }
        }
      },
      Promotion: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          type: { type: 'string', enum: ['percent', 'fixed'] },
          value: { type: 'number' },
          validUntil: { type: 'string', format: 'date-time' },
          usageLimit: { type: 'number' },
          usedCount: { type: 'number' }
        }
      },
      PromotionRequest: {
        type: 'object',
        required: ['code', 'type', 'value', 'validUntil'],
        properties: {
          code: { type: 'string' },
          type: { type: 'string', enum: ['percent', 'fixed'] },
          value: { type: 'number' },
          validUntil: { type: 'string', format: 'date-time' },
          usageLimit: { type: 'number' }
        }
      },
      Review: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          user: { type: 'string' }
        }
      },
      ReviewRequest: {
        type: 'object',
        required: ['productId', 'rating'],
        properties: {
          productId: { type: 'integer' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' }
        }
      },
      UserStats: {
        type: 'object',
        properties: {
          totalUsers: { type: 'number' },
          newUsers: { type: 'number' },
          lockedUsers: { type: 'number' },
          activeCustomers: { type: 'number' }
        }
      },
      TopCustomer: {
        type: 'object',
        properties: {
          userId: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          totalOrders: { type: 'number' },
          totalSpent: { type: 'number' }
        }
      },
      ReportResponse: {
        type: 'object',
        properties: {
          totalOrders: { type: 'number' },
          totalRevenue: { type: 'number' },
          bestSeller: { type: 'string' },
          userStats: { $ref: '#/components/schemas/UserStats' },
          topCustomers: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopCustomer' }
          }
        }
      },
      DailyBreakdownEntry: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date' },
          totalOrders: { type: 'number' },
          totalRevenue: { type: 'number' }
        }
      },
      MonthlyReportResponse: {
        allOf: [
          { $ref: '#/components/schemas/ReportResponse' },
          {
            type: 'object',
            properties: {
              dailyBreakdown: {
                type: 'array',
                items: { $ref: '#/components/schemas/DailyBreakdownEntry' }
              }
            }
          }
        ]
      },
      MonthlyBreakdownEntry: {
        type: 'object',
        properties: {
          month: { type: 'string' },
          totalOrders: { type: 'number' },
          totalRevenue: { type: 'number' }
        }
      },
      YearlyReportResponse: {
        allOf: [
          { $ref: '#/components/schemas/ReportResponse' },
          {
            type: 'object',
            properties: {
              monthlyBreakdown: {
                type: 'array',
                items: { $ref: '#/components/schemas/MonthlyBreakdownEntry' }
              }
            }
          }
        ]
      },
      TopProduct: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          name: { type: 'string' },
          totalSold: { type: 'number' }
        }
      },
      TopProductsResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopProduct' }
          }
        }
      },
      OrderStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'confirmed', 'delivered'] }
        }
      },
      SepayCheckoutResponse: {
        type: 'object',
        properties: {
          checkoutUrl: { type: 'string' }
        }
      },
      Profile: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 6 }
        }
      },
      ManagedUser: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          status: { type: 'string', enum: ['active', 'locked'] },
          lockedAt: { type: 'string', format: 'date-time', nullable: true },
          provider: { type: 'string', enum: ['local', 'google'] },
          role: { type: 'string', enum: ['customer', 'admin'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      FeedbackRequest: {
        type: 'object',
        required: ['email', 'message'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          orderId: { type: 'integer' },
          productId: { type: 'integer' },
          message: { type: 'string' }
        }
      },
      Feedback: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          orderId: { type: 'integer' },
          productId: { type: 'integer' },
          message: { type: 'string' },
          status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] },
          response: { type: 'string' }
        }
      },
      FeedbackStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['open', 'in_progress', 'resolved'] }
        }
      },
      FeedbackResponseRequest: {
        type: 'object',
        required: ['response'],
        properties: { response: { type: 'string' } }
      },
      ConsultationMessage: {
        type: 'object',
        properties: {
          sender: { type: 'string', enum: ['user', 'admin'] },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      ConsultationRequest: {
        type: 'object',
        required: ['name', 'email', 'topic', 'message'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          topic: { type: 'string' },
          message: { type: 'string' }
        }
      },
      Consultation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          topic: { type: 'string' },
          status: { type: 'string', enum: ['open', 'closed'] },
          messages: {
            type: 'array',
            items: { $ref: '#/components/schemas/ConsultationMessage' }
          }
        }
      },
      ConsultationMessageRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản khách hàng',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } }
          }
        },
        responses: {
          201: successResponse('Đăng ký thành công', { $ref: '#/components/schemas/AuthResponse' }),
          409: errorResponse('Email đã tồn tại')
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập (user hoặc admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } }
          }
        },
        responses: {
          200: successResponse('Đăng nhập thành công', { $ref: '#/components/schemas/AuthResponse' }),
          401: errorResponse('Sai thông tin đăng nhập')
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Lấy access token mới từ refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } }
          }
        },
        responses: {
          200: successResponse('Refresh thành công', {
            type: 'object',
            properties: { accessToken: { type: 'string' } }
          }),
          401: errorResponse('Refresh token không hợp lệ')
        }
      }
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Yêu cầu đặt lại mật khẩu',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } }
          }
        },
        responses: {
          200: successResponse('Đã gửi email hướng dẫn')
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Đặt lại mật khẩu bằng token',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } }
          }
        },
        responses: {
          200: successResponse('Đặt lại mật khẩu thành công'),
          400: errorResponse('Token không hợp lệ'),
          404: errorResponse('Email không tồn tại')
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Danh sách sản phẩm',
        responses: {
          200: successResponse('Danh sách sản phẩm', {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          })
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Tạo sản phẩm (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ProductRequest' } }
          }
        },
        responses: {
          201: successResponse('Tạo sản phẩm thành công', { $ref: '#/components/schemas/Product' })
        }
      }
    },
    '/products/{productId}': {
      get: {
        tags: ['Products'],
        summary: 'Chi tiết sản phẩm',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Thông tin sản phẩm', { $ref: '#/components/schemas/Product' }),
          404: errorResponse('Không tìm thấy sản phẩm')
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Cập nhật sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ProductRequest' } }
          }
        },
        responses: {
          200: successResponse('Cập nhật thành công', { $ref: '#/components/schemas/Product' }),
          404: errorResponse('Không tìm thấy sản phẩm')
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Xóa sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: noContentResponse('Đã xóa'),
          404: errorResponse('Không tìm thấy sản phẩm')
        }
      }
    },
    '/products/categories/all': {
      get: {
        tags: ['Products'],
        summary: 'Danh sách danh mục',
        responses: {
          200: successResponse('Danh sách danh mục', {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' }
          })
        }
      }
    },
    '/products/categories': {
      post: {
        tags: ['Products'],
        summary: 'Tạo danh mục (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } }
          }
        },
        responses: {
          201: successResponse('Tạo danh mục thành công', { $ref: '#/components/schemas/Category' }),
          409: errorResponse('Danh mục đã tồn tại')
        }
      }
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Tạo đơn hàng (khách hoặc user)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } } }
        },
        responses: {
          201: successResponse('Tạo đơn hàng thành công', { $ref: '#/components/schemas/CreateOrderResponse' }),
          400: errorResponse('Giỏ hàng hoặc mã khuyến mãi không hợp lệ')
        }
      },
      get: {
        tags: ['Orders'],
        summary: 'Danh sách đơn hàng (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Danh sách đơn hàng', {
            type: 'array',
            items: { $ref: '#/components/schemas/Order' }
          })
        }
      }
    },
    '/orders/me': {
      get: {
        tags: ['Orders'],
        summary: 'Đơn hàng của tài khoản hiện tại',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Lịch sử đơn hàng', {
            type: 'array',
            items: { $ref: '#/components/schemas/Order' }
          })
        }
      }
    },
    '/orders/{orderId}': {
      get: {
        tags: ['Orders'],
        summary: 'Chi tiết đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Thông tin đơn hàng', { $ref: '#/components/schemas/Order' }),
          403: errorResponse('Không có quyền truy cập'),
          404: errorResponse('Không tìm thấy đơn hàng')
        }
      }
    },
    '/orders/{orderId}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Cập nhật trạng thái đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/OrderStatusUpdateRequest' } }
          }
        },
        responses: {
          200: successResponse('Cập nhật trạng thái thành công', { $ref: '#/components/schemas/Order' }),
          404: errorResponse('Không tìm thấy đơn hàng')
        }
      }
    },
    '/orders/{orderId}/payment/sepay': {
      post: {
        tags: ['Orders'],
        summary: 'Tạo link thanh toán Sepay cho đơn hàng',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Tạo link thành công', { $ref: '#/components/schemas/SepayCheckoutResponse' }),
          404: errorResponse('Không tìm thấy đơn hàng')
        }
      }
    },
    '/orders/payment/sepay/callback': {
      post: {
        tags: ['Orders'],
        summary: 'Webhook callback từ Sepay',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true
              }
            }
          }
        },
        responses: {
          200: successResponse('Đã xử lý callback'),
          400: errorResponse('Chữ ký không hợp lệ')
        }
      }
    },
    '/promotions': {
      get: {
        tags: ['Promotions'],
        summary: 'Danh sách mã khuyến mãi',
        responses: {
          200: successResponse('Danh sách khuyến mãi', {
            type: 'array',
            items: { $ref: '#/components/schemas/Promotion' }
          })
        }
      },
      post: {
        tags: ['Promotions'],
        summary: 'Tạo mã khuyến mãi (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PromotionRequest' } }
          }
        },
        responses: {
          201: successResponse('Tạo mã khuyến mãi', { $ref: '#/components/schemas/Promotion' })
        }
      }
    },
    '/promotions/{code}': {
      get: {
        tags: ['Promotions'],
        summary: 'Kiểm tra mã khuyến mãi',
        parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: successResponse('Thông tin mã khuyến mãi', { $ref: '#/components/schemas/Promotion' }),
          404: errorResponse('Không tìm thấy mã khuyến mãi')
        }
      }
    },
    '/reviews/{productId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Danh sách đánh giá theo sản phẩm',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Danh sách đánh giá', {
            type: 'array',
            items: { $ref: '#/components/schemas/Review' }
          })
        }
      }
    },
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Tạo đánh giá (yêu cầu đăng nhập)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ReviewRequest' } }
          }
        },
        responses: {
          201: successResponse('Đã tạo đánh giá', { $ref: '#/components/schemas/Review' }),
          400: errorResponse('Bạn đã đánh giá sản phẩm này')
        }
      }
    },
    '/reports/daily/{date}': {
      get: {
        tags: ['Reports'],
        summary: 'Báo cáo doanh thu theo ngày (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'date', in: 'path', required: true, schema: { type: 'string', example: '2025-01-01' } }
        ],
        responses: {
          200: successResponse('Báo cáo theo ngày', { $ref: '#/components/schemas/ReportResponse' })
        }
      }
    },
    '/reports/monthly/{year}/{month}': {
      get: {
        tags: ['Reports'],
        summary: 'Báo cáo theo tháng (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'path', required: true, schema: { type: 'integer', example: 2025 } },
          { name: 'month', in: 'path', required: true, schema: { type: 'integer', example: 5 } }
        ],
        responses: {
          200: successResponse('Báo cáo tháng', { $ref: '#/components/schemas/MonthlyReportResponse' })
        }
      }
    },
    '/reports/yearly/{year}': {
      get: {
        tags: ['Reports'],
        summary: 'Báo cáo theo năm (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'path', required: true, schema: { type: 'integer', example: 2025 } }
        ],
        responses: {
          200: successResponse('Báo cáo năm', { $ref: '#/components/schemas/YearlyReportResponse' })
        }
      }
    },
    '/reports/top-products': {
      get: {
        tags: ['Reports'],
        summary: 'Top sản phẩm bán chạy',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 5 }
          }
        ],
        responses: {
          200: successResponse('Top sản phẩm', { $ref: '#/components/schemas/TopProductsResponse' })
        }
      }
    },
    '/feedback': {
      post: {
        tags: ['Feedback'],
        summary: 'Gửi phản hồi / khiếu nại',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FeedbackRequest' } } }
        },
        responses: {
          201: successResponse('Đã ghi nhận phản hồi', { $ref: '#/components/schemas/Feedback' })
        }
      },
      get: {
        tags: ['Feedback'],
        summary: 'Danh sách phản hồi (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Danh sách phản hồi', {
            type: 'array',
            items: { $ref: '#/components/schemas/Feedback' }
          })
        }
      }
    },
    '/feedback/me': {
      get: {
        tags: ['Feedback'],
        summary: 'Phản hồi của tài khoản hiện tại',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Danh sách phản hồi cá nhân', {
            type: 'array',
            items: { $ref: '#/components/schemas/Feedback' }
          })
        }
      }
    },
    '/feedback/{feedbackId}': {
      get: {
        tags: ['Feedback'],
        summary: 'Chi tiết phản hồi',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'feedbackId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: successResponse('Chi tiết phản hồi', { $ref: '#/components/schemas/Feedback' }),
          403: errorResponse('Không có quyền'),
          404: errorResponse('Không tìm thấy')
        }
      }
    },
    '/feedback/{feedbackId}/status': {
      patch: {
        tags: ['Feedback'],
        summary: 'Cập nhật trạng thái phản hồi (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'feedbackId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FeedbackStatusUpdateRequest' } }
          }
        },
        responses: {
          200: successResponse('Đã cập nhật', { $ref: '#/components/schemas/Feedback' }),
          404: errorResponse('Không tìm thấy')
        }
      }
    },
    '/feedback/{feedbackId}/respond': {
      post: {
        tags: ['Feedback'],
        summary: 'Admin phản hồi khách hàng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'feedbackId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FeedbackResponseRequest' } }
          }
        },
        responses: {
          200: successResponse('Đã phản hồi', { $ref: '#/components/schemas/Feedback' }),
          404: errorResponse('Không tìm thấy')
        }
      }
    },
    '/consultations': {
      post: {
        tags: ['Consultations'],
        summary: 'Mở phiên tư vấn / chat với admin',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ConsultationRequest' } } }
        },
        responses: {
          201: successResponse('Đã tạo cuộc tư vấn', { $ref: '#/components/schemas/Consultation' })
        }
      },
      get: {
        tags: ['Consultations'],
        summary: 'Danh sách cuộc tư vấn (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Danh sách tư vấn', {
            type: 'array',
            items: { $ref: '#/components/schemas/Consultation' }
          })
        }
      }
    },
    '/consultations/me': {
      get: {
        tags: ['Consultations'],
        summary: 'Danh sách tư vấn của tài khoản',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Danh sách tư vấn cá nhân', {
            type: 'array',
            items: { $ref: '#/components/schemas/Consultation' }
          })
        }
      }
    },
    '/consultations/{consultationId}': {
      get: {
        tags: ['Consultations'],
        summary: 'Chi tiết cuộc tư vấn',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'consultationId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: successResponse('Chi tiết tư vấn', { $ref: '#/components/schemas/Consultation' }),
          403: errorResponse('Không có quyền'),
          404: errorResponse('Không tìm thấy cuộc tư vấn')
        }
      }
    },
    '/consultations/{consultationId}/messages': {
      post: {
        tags: ['Consultations'],
        summary: 'Khách gửi thêm tin nhắn',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'consultationId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ConsultationMessageRequest' } }
          }
        },
        responses: {
          200: successResponse('Đã gửi tin nhắn', { $ref: '#/components/schemas/Consultation' }),
          403: errorResponse('Không có quyền'),
          404: errorResponse('Không tìm thấy cuộc tư vấn')
        }
      }
    },
    '/consultations/{consultationId}/admin/messages': {
      post: {
        tags: ['Consultations'],
        summary: 'Admin trả lời tin nhắn',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'consultationId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ConsultationMessageRequest' } }
          }
        },
        responses: {
          200: successResponse('Đã phản hồi', { $ref: '#/components/schemas/Consultation' }),
          404: errorResponse('Không tìm thấy cuộc tư vấn')
        }
      }
    },
    '/consultations/{consultationId}/close': {
      post: {
        tags: ['Consultations'],
        summary: 'Đóng cuộc tư vấn',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'consultationId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: successResponse('Đã đóng cuộc tư vấn', { $ref: '#/components/schemas/Consultation' }),
          404: errorResponse('Không tìm thấy cuộc tư vấn')
        }
      }
    },
    '/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Xem thông tin cá nhân',
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse('Thông tin cá nhân', { $ref: '#/components/schemas/Profile' })
        }
      },
      put: {
        tags: ['Profile'],
        summary: 'Cập nhật thông tin cá nhân',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } }
        },
        responses: {
          200: successResponse('Đã cập nhật', { $ref: '#/components/schemas/Profile' })
        }
      }
    },
    '/profile/password': {
      put: {
        tags: ['Profile'],
        summary: 'Đổi mật khẩu',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } }
          }
        },
        responses: {
          200: successResponse('Đổi mật khẩu thành công'),
          400: errorResponse('Mật khẩu hiện tại không đúng')
        }
      }
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Danh sách người dùng',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['active', 'locked'] }
          },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Tìm theo tên/email/sđt' }
        ],
        responses: {
          200: successResponse('Danh sách người dùng', {
            type: 'array',
            items: { $ref: '#/components/schemas/ManagedUser' }
          })
        }
      }
    },
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Xem chi tiết người dùng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Chi tiết người dùng', { $ref: '#/components/schemas/ManagedUser' }),
          404: errorResponse('Không tìm thấy người dùng')
        }
      }
    },
    '/users/{userId}/lock': {
      patch: {
        tags: ['Users'],
        summary: 'Khoá tài khoản người dùng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Đã khoá người dùng', { $ref: '#/components/schemas/ManagedUser' }),
          404: errorResponse('Không tìm thấy người dùng')
        }
      }
    },
    '/users/{userId}/unlock': {
      patch: {
        tags: ['Users'],
        summary: 'Mở khoá tài khoản người dùng',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: successResponse('Đã mở khoá người dùng', { $ref: '#/components/schemas/ManagedUser' }),
          404: errorResponse('Không tìm thấy người dùng')
        }
      }
    }
  }
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: []
});

export default swaggerSpec;
