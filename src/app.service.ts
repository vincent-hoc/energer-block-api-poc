import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Energer Block API - Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            max-width: 420px;
            width: 100%;
            padding: 48px 40px;
        }

        .logo {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo h1 {
            font-family: 'Rajdhani', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
        }

        .logo p {
            font-size: 14px;
            color: #6b7280;
            font-weight: 400;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 12px 16px;
            font-size: 15px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        input:focus {
            outline: none;
            border-color: #4d65ff;
            box-shadow: 0 0 0 3px rgba(77, 101, 255, 0.1);
        }

        .btn-login {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            background: #4d65ff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
        }

        .btn-login:hover {
            background: #3d55ef;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(77, 101, 255, 0.3);
        }

        .btn-login:active {
            transform: translateY(0);
        }

        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            font-size: 13px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>ENERGER</h1>
            <p>Block API - Authentification</p>
        </div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" placeholder="Entrez votre nom d'utilisateur" required>
            </div>

            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" placeholder="Entrez votre mot de passe" required>
            </div>

            <button type="submit" class="btn-login">Se connecter</button>
        </form>

        <div class="footer">
            <p>&copy; 2024 Energer.ai - Digital Trust Infrastructure</p>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Basic auth would be handled by the API endpoints
            alert('Cette page est informative. Utilisez les endpoints API avec Basic Authentication.');
        });
    </script>
</body>
</html>
    `;
  }
}
