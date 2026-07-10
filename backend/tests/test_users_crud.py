class TestGetUsers:
    async def test_list_users(self, auth_client, create_user):
        client, _ = auth_client
        await create_user(name="test1", email="test1@example.com")
        response = await client.get("/users/")
        assert response.status_code == 200
        body = response.json()
        assert body["total"] >= 2
        emails = [item["email"] for item in body["items"]]
        assert "test1@example.com" in emails

    async def test_list_users_requires_auth(self, client):
        response = await client.get("/users/")
        assert response.status_code in (401, 403)

    async def test_search_users(self, auth_client, create_user):
        client, _ = auth_client
        await create_user(name="test2", email="test2@example.com")
        response = await client.get("/users/", params={"search": "test2"})
        assert response.status_code == 200
        body = response.json()
        assert body["total"] == 1
        assert body["items"][0]["email"] == "test2@example.com"


class TestGetUserById:
    async def test_get_user_by_id(self, auth_client):
        client, user = auth_client
        response = await client.get(f"/users/{user.id}")
        assert response.status_code == 200
        assert response.json()["id"] == user.id


class TestUpdateUser:
    async def test_update_user_name(self, auth_client):
        client, user = auth_client
        response = await client.patch(f"/users/{user.id}", json={"name": "test2"})
        assert response.status_code == 200
        assert response.json()["name"] == "test2"

    async def test_update_user_invalid_email(self, auth_client):
        client, user = auth_client
        response = await client.patch(f"/users/{user.id}", json={"email": "invalid-email"})
        assert response.status_code == 400

    async def test_update_user_no_fields(self, auth_client):
        client, user = auth_client
        response = await client.patch(f"/users/{user.id}", json={})
        assert response.status_code == 400

    async def test_update_nonexistent_user(self, auth_client):
        client, _ = auth_client
        response = await client.patch("/users/999999", json={"name": "test404"})
        assert response.status_code == 404


class TestDeleteUser:
    async def test_delete_other_user(self, auth_client, create_user):
        client, _ = auth_client
        other, _ = await create_user(name="test1", email="test1@example.com")
        response = await client.delete(f"/users/{other.id}")
        assert response.status_code == 200

        follow_up = await client.get(f"/users/{other.id}")
        assert follow_up.json() is None

    async def test_cannot_delete_own_account(self, auth_client):
        client, user = auth_client
        response = await client.delete(f"/users/{user.id}")
        assert response.status_code == 403
