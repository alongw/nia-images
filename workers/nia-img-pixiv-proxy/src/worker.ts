// 导入 Cloudflare Workers 的类型定义
import { FetchEvent } from '@cloudflare/workers-types';

addEventListener('fetch', (event: FetchEvent) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request): Promise<Response> {
	// 从 URL 中获取 pixivImgId 和 pixivImgPage
	const url = new URL(request.url);
	const pixivImgId = getPixivImgId(url.pathname);
	const pixivImgPage = getPixivImgPage(url.pathname);

	// 从查询参数中获取 key
	const authKey = url.searchParams.get('key');

	// 如果缺少必要参数，返回拒绝访问的响应
	if (!pixivImgId || !pixivImgPage || !authKey) {
		return new Response(
			JSON.stringify({
				status: 403,
				message: '参数不足',
			}),
			{ status: 200 }
		);
	}

	// 向认证服务器发送 POST 请求进行鉴权
	const authServerURL = 'http://localhost:10099/api/public/pixivAuth';
	const authRequestBody = new URLSearchParams({
		key: authKey,
		pixivImgId: pixivImgId,
		pixivImgPage: pixivImgPage,
	});

	try {
		const authResponse = await fetch(authServerURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...request.headers,
			},
			body: authRequestBody.toString(),
		});

		const authResult: { status: number; message: string } = await authResponse.json();

		// 如果认证失败，返回拒绝访问的响应
		if (authResult.status !== 200) {
			return new Response(JSON.stringify(authResult), { status: 200 });
		}

		// 如果认证成功，代理请求到 Pixiv
		let newUrl = new URL(request.url);
		newUrl.hostname = 'i.pximg.net';
		newUrl.port = '';
		newUrl.searchParams.delete('key');
		newUrl.protocol = 'https:';

		// 创建新请求，代理到 Pixiv
		let newRequest = new Request(newUrl.toString(), {
			method: request.method,
			headers: {
				Referer: 'https://www.pixiv.net/',
				'user-agent': 'Cloudflare Workers',
			},
			body: request.body,
		});

		// 代理请求到 Pixiv
		let pixivResponse = await fetch(newRequest);

		// 透明传递 Pixiv 的响应
		return new Response(await pixivResponse.text(), {
			status: pixivResponse.status,
			statusText: pixivResponse.statusText,
			headers: pixivResponse.headers,
		});
	} catch (error) {
		console.error('Authentication failed:', error);
		return new Response(
			JSON.stringify({
				status: 500,
				msg: '服务器错误',
			}),
			{ status: 200 }
		);
	}
}

// 从路径中提取 pixivImgId
function getPixivImgId(path: string): string | null {
	const match = path.match(/(\d+)_p\d+/);
	return match ? match[1] : null;
}

// 从路径中提取 pixivImgPage
function getPixivImgPage(path: string): string | null {
	const match = path.match(/_p(\d+)/);
	return match ? match[1] : null;
}
