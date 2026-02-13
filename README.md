# FreshCart - Modern E-Commerce Platform

A high-performance, modern e-commerce application built with Next.js 14, React, TypeScript, and Tailwind CSS. This project features a professional structure, optimized performance, and a seamless shopping experience.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS and shadcn/ui components
- **Product Management**: Browse products by categories, brands, and search
- **Shopping Cart**: Add, remove, and manage cart items with real-time updates
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure login/signup with JWT tokens
- **Order Management**: Track orders and purchase history
- **Product Reviews**: Rate and review products
- **Responsive Design**: Mobile-first approach with excellent mobile experience
- **Payment Integration**: Stripe payment integration for secure checkout
- **Image Optimization**: Next.js Image component for optimized loading

## 🎯 Performance Optimizations

### Image Optimization

- **Next.js Image Component**: All images use the optimized `<Image>` component
- **WebP & AVIF Support**: Modern image formats for better compression
- **Responsive Images**: Proper sizing for different screen sizes
- **Lazy Loading**: Images load as needed to improve initial page load
- **Remote Images**: Configured for Route.misr API images

### Code Optimization

- **React Strict Mode**: Enabled for better development practices
- **Console Removal**: Production builds automatically remove console logs (except errors/warnings)
- **Font Optimization**: Google Fonts with `display: swap` for better performance
- **Code Splitting**: Automatic code splitting with Next.js App Router

### SEO & Metadata

- **Comprehensive Metadata**: Complete SEO tags for better search engine ranking
- **Open Graph Tags**: Social media sharing optimization
- **Structured Data**: Semantic HTML and metadata
- **Robots.txt**: Proper search engine crawling configuration

## 📁 Project Structure

```
ecomm-project-new/
├── app/                          # Next.js App Router pages
│   ├── addresses/               # Address management
│   ├── brands/                  # Brands listing and details
│   ├── cart/                    # Shopping cart
│   ├── categories/              # Categories listing and details
│   ├── checkout/                # Checkout process
│   ├── forgot-password/         # Password recovery
│   ├── login/                   # User login
│   ├── orders/                  # Order history
│   ├── products/                # Products listing and details
│   ├── profile/                 # User profile
│   ├── signup/                  # User registration
│   ├── wishlist/                # Wishlist management
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with metadata
│   ├── loading.tsx              # Global loading state
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Homepage
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── lib/                     # Utility libraries
│   ├── providers/               # React Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── CartProvider.tsx
│   │   └── WishlistProvider.tsx
│   ├── services/                # API service layers
│   │   ├── addressService.ts
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── productService.ts
│   │   ├── reviewService.ts
│   │   └── wishlistService.ts
│   └── utils/                   # Utility functions
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **API Client**: Axios
- **Authentication**: JWT
- **Image Slider**: Swiper.js
- **Icons**: Lucide React
- **Payment**: Stripe
- **Form Validation**: Custom validators

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecomm-project-new
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the values in `.env.local`:

   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_BASE_URL=https://ecommerce.routemisr.com/api
   NODE_ENV=development
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎨 Key Features Explained

### Image Optimization

All product images, category images, and brand logos use Next.js's optimized `<Image>` component with:

- Automatic WebP/AVIF conversion
- Responsive sizing based on viewport
- Lazy loading for better performance
- Blur placeholder support

### State Management

The application uses React Context API with three main providers:

- **AuthProvider**: User authentication and session management
- **CartProvider**: Shopping cart state and operations
- **WishlistProvider**: Wishlist state and operations

### API Integration

All API calls are centralized in service files with:

- Axios interceptors for authentication
- Error handling and retry logic
- Type-safe responses
- Centralized configuration

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized interactions
- Adaptive layouts for all screen sizes

## 🔧 Configuration

### Next.js Config (`next.config.ts`)

- Image optimization for remote URLs
- WebP and AVIF format support
- Console log removal in production
- React Strict Mode enabled
- Security headers configured

### Tailwind Config

- Custom color scheme
- Extended spacing and sizing
- Custom animations
- shadcn/ui integration

## 📱 Pages Overview

- **Homepage** (`/`): Featured products with hero slider
- **Products** (`/products`): All products with filters
- **Product Details** (`/products/[id]`): Detailed view with reviews
- **Categories** (`/categories`): Browse by category
- **Brands** (`/brands`): Browse by brand
- **Cart** (`/cart`): Shopping cart management
- **Wishlist** (`/wishlist`): Saved products
- **Checkout** (`/checkout`): Payment and order placement
- **Orders** (`/orders`): Order history
- **Profile** (`/profile`): User account management

## 🔐 Authentication

The app uses JWT token-based authentication:

- Tokens stored in localStorage
- Automatic token injection in API requests
- Protected routes with authentication checks
- Session persistence across page reloads

## 🎯 Performance Metrics

The application is optimized for:

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://ecommerce.routemisr.com/api

# Environment
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Re-usable components
- [Route.misr API](https://ecommerce.routemisr.com) - E-commerce backend API

## 📞 Support

For support, email support@freshcart.com or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
