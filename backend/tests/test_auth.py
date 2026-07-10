import pytest


class TestSignup:
    async def test_signup_creates_user(self, client):
        response = await client.post(
            "/auths/signup",
            json={
                "name": "test",
                "email": "test@example.com",
                "password": "Password123!",
                "confirmPassword": "Password123!",
            },
        )
        assert response.status_code == 200
        body = response.json()
        assert body["name"] == "test"
        assert body["email"] == "test@example.com"
        assert "password" not in body
        assert "access_token" not in response.cookies
        assert "refresh_token" not in response.cookies

    async def test_signup_duplicate_email_rejected(self, client, create_user):
        user, _ = await create_user(email="test1@example.com")
        response = await client.post(
            "/auths/signup",
            json={
                "name": "test2",
                "email": "test1@example.com",
                "password": "Password123!",
                "confirmPassword": "Password123!",
            },
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    async def test_signup_invalid_email_rejected(self, client):
        response = await client.post(
            "/auths/signup",
            json={
                "name": "test",
                "email": "not-an-email",
                "password": "Password123!",
                "confirmPassword": "Password123!",
            },
        )
        assert response.status_code == 400


class TestLogin:
    async def test_login_success(self, client, create_user):
        user, password = await create_user(email="test1@example.com")
        response = await client.post(
            "/auths/login", json={"email": user.email, "password": password}
        )
        assert response.status_code == 200
        body = response.json()
        assert body["email"] == "test1@example.com"
        assert "access_token" in response.cookies
        assert "refresh_token" in response.cookies

    async def test_login_wrong_password(self, client, create_user):
        user, _ = await create_user(email="test1@example.com")
        response = await client.post(
            "/auths/login",
            json={"email": user.email, "password": "WrongPassword!"},
        )
        assert response.status_code == 401

    async def test_login_nonexistent_email(self, client):
        response = await client.post(
            "/auths/login",
            json={"email": "test404@example.com", "password": "Whatever123!"},
        )
        assert response.status_code == 401

    async def test_login_invalid_email_format(self, client):
        response = await client.post(
            "/auths/login",
            json={"email": "not-an-email", "password": "Whatever123!"},
        )
        assert response.status_code == 401


class TestMe:
    async def test_me_returns_current_user(self, auth_client):
        client, user = auth_client
        response = await client.get("/auths/me")
        assert response.status_code == 200
        assert response.json()["email"] == user.email

    async def test_me_unauthenticated_rejected(self, client):
        response = await client.get("/auths/me")
        assert response.status_code in (401, 403)


class TestLogout:
    async def test_logout_clears_cookies(self, auth_client):
        client, _ = auth_client
        response = await client.post("/auths/logout")
        assert response.status_code == 200
        assert response.json()["message"] == "Logged out successfully"
