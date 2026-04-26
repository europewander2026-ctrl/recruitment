import { NextRequest, NextResponse } from 'next/server';

// Auth
import * as authForgotPassword from '@/controllers/auth/forgot-password';
import * as authLogin from '@/controllers/auth/login';
import * as authLogout from '@/controllers/auth/logout';
import * as authResetPassword from '@/controllers/auth/reset-password';

// Checkout
import * as checkoutNomadpay from '@/controllers/checkout/nomadpay';
import * as checkoutPayoneer from '@/controllers/checkout/payoneer';

// Webhooks
import * as webhooksNomadpay from '@/controllers/webhooks/nomadpay';
import * as webhooksPayoneer from '@/controllers/webhooks/payoneer';

// Other
import * as applications from '@/controllers/applications';
import * as applicationsScore from '@/controllers/applications/score';
import * as applicationsStatus from '@/controllers/applications/status';
import * as content from '@/controllers/content';
import * as downloadDocument from '@/controllers/download-document';
import * as jobs from '@/controllers/jobs';
import * as notifications from '@/controllers/notifications';
import * as settingsGeneral from '@/controllers/settings/general';
import * as settingsProfile from '@/controllers/settings/profile';
import * as stats from '@/controllers/stats';
import * as taxonomies from '@/controllers/taxonomies';
import * as verifyCode from '@/controllers/verify-code';

const routes: Record<string, any> = {
  'auth/forgot-password': authForgotPassword,
  'auth/login': authLogin,
  'auth/logout': authLogout,
  'auth/reset-password': authResetPassword,
  'checkout/nomadpay': checkoutNomadpay,
  'checkout/payoneer': checkoutPayoneer,
  'webhooks/nomadpay': webhooksNomadpay,
  'webhooks/payoneer': webhooksPayoneer,
  'applications': applications,
  'applications/score': applicationsScore,
  'applications/status': applicationsStatus,
  'content': content,
  'download-document': downloadDocument,
  'jobs': jobs,
  'notifications': notifications,
  'notifications/read': notifications,
  'settings/general': settingsGeneral,
  'settings/profile': settingsProfile,
  'stats': stats,
  'taxonomies': taxonomies,
  'verify-code': verifyCode,
};

async function handleRequest(req: NextRequest, params: any) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];
  const path = slug.join('/');
  const method = req.method as string;

  const controller = routes[path];
  
  if (!controller) {
    return new NextResponse(JSON.stringify({ error: 'Route Not Found' }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const handler = controller[method];
  
  if (!handler) {
    return new NextResponse(JSON.stringify({ error: `Method ${method} Not Allowed` }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // Pass the raw request to the controller, the exact same way Next.js used to do it
  return handler(req, { params: resolvedParams });
}

export async function GET(req: NextRequest, { params }: any) { return handleRequest(req, params); }
export async function POST(req: NextRequest, { params }: any) { return handleRequest(req, params); }
export async function PUT(req: NextRequest, { params }: any) { return handleRequest(req, params); }
export async function DELETE(req: NextRequest, { params }: any) { return handleRequest(req, params); }
export async function PATCH(req: NextRequest, { params }: any) { return handleRequest(req, params); }
export async function OPTIONS(req: NextRequest, { params }: any) { return handleRequest(req, params); }
