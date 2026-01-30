import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getDashboard(): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
    <title>Energer - API Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #F0EFEC;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Header */
        .header {
            background: white;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-logo img {
            height: 48px;
        }

        .header-user {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            background: #dedcd4;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        }

        .btn-logout {
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            background: transparent;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-logout:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
        }

        /* Main content */
        .main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px;
        }

        .container {
            text-align: center;
            max-width: 800px;
        }

        .title {
            font-family: 'Rajdhani', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
        }

        .subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 48px;
        }

        .buttons-container {
            display: flex;
            gap: 32px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .api-card {
            background: white;
            border-radius: 16px;
            padding: 40px 48px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            min-width: 280px;
        }

        .api-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .api-card.summarize:hover {
            border-color: #00b48f;
        }

        .api-card.analyse:hover {
            border-color: #007f72;
        }

        .api-card-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }

        .api-card.summarize .api-card-icon {
            background: linear-gradient(135deg, #d0f5ed 0%, #a7ede0 100%);
        }

        .api-card.analyse .api-card-icon {
            background: linear-gradient(135deg, #ccebe8 0%, #a3ddd8 100%);
        }

        .api-card-icon svg {
            width: 32px;
            height: 32px;
        }

        .api-card.summarize .api-card-icon svg {
            color: #00b48f;
        }

        .api-card.analyse .api-card-icon svg {
            color: #007f72;
        }

        .api-card-title {
            font-family: 'Rajdhani', sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        .api-card-description {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
        }

        /* Footer */
        .footer {
            background: white;
            padding: 24px 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }

        .footer p {
            font-size: 13px;
            color: #9ca3af;
        }

        .footer a {
            color: #004d52;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-logo">
            <img src="https://cdn.prod.website-files.com/684fc8bdc6e7edd505c58655/69147295c08d5fe3c86bbbf7_energer-logo_energer-default%20black.svg" alt="Energer">
        </div>
        <div class="header-user">
            <div class="user-avatar" id="userAvatar">D</div>
            <button class="btn-logout" onclick="logout()">Deconnexion</button>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <h1 class="title">Plateforme de test<br>SCAN</h1>

            <div class="buttons-container">
                <div class="api-card summarize" onclick="window.location.href='/test/summarize'">
                    <div class="api-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 class="api-card-title">Synthèse document</h2>
                    <p class="api-card-description">Extraction et analyse d'un document unique avec identification FOST</p>
                </div>

                <div class="api-card analyse" onclick="window.location.href='/test/analyse'">
                    <div class="api-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 class="api-card-title">Analyse dossier</h2>
                    <p class="api-card-description">Analyse complete d'un dossier multi-documents avec conformite</p>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p>&copy; 2026 <a href="https://www.energer.ai" target="_blank">Energer.ai</a> - Quantum Of Trust</p>
    </footer>

    <script>
        // Check authentication
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/';
        }

        // Set user avatar initial
        try {
            const decoded = atob(token);
            const username = decoded.split(':')[0];
            document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();
        } catch (e) {}

        function logout() {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }
    </script>
</body>
</html>
    `;
  }
}
