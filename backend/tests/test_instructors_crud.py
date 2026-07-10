class TestCreateInstructor:
    async def test_create_instructor(self, auth_client):
        client, _ = auth_client
        response = await client.post(
            "/instructors/",
            json={"name": "test", "expertise": "test", "bio": "test"},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["name"] == "test"
        assert body["expertise"] == "test"

    async def test_create_instructor_requires_auth(self, client):
        response = await client.post(
            "/instructors/",
            json={"name": "test", "expertise": "test", "bio": "test"},
        )
        assert response.status_code in (401, 403)


class TestListInstructors:
    async def test_list_instructors(self, auth_client, create_instructor):
        client, _ = auth_client
        await create_instructor(name="test1")
        response = await client.get("/instructors/")
        assert response.status_code == 200
        body = response.json()
        assert body["total"] >= 1
        names = [item["name"] for item in body["items"]]
        assert "test1" in names

    async def test_search_instructors(self, auth_client, create_instructor):
        client, _ = auth_client
        await create_instructor(name="test2", expertise="test2")
        response = await client.get("/instructors/", params={"search": "test2"})
        assert response.status_code == 200
        body = response.json()
        assert body["total"] == 1


class TestGetInstructor:
    async def test_get_instructor_by_id(self, auth_client, create_instructor):
        client, _ = auth_client
        instructor = await create_instructor()
        response = await client.get(f"/instructors/{instructor.id}")
        assert response.status_code == 200
        assert response.json()["id"] == instructor.id


class TestUpdateInstructor:
    async def test_update_instructor(self, auth_client, create_instructor):
        client, _ = auth_client
        instructor = await create_instructor()
        response = await client.patch(f"/instructors/{instructor.id}", json={"expertise": "test2"})
        assert response.status_code == 200
        assert response.json()["expertise"] == "test2"

    async def test_update_instructor_no_fields(self, auth_client, create_instructor):
        client, _ = auth_client
        instructor = await create_instructor()
        response = await client.patch(f"/instructors/{instructor.id}", json={})
        assert response.status_code == 400


class TestDeleteInstructor:
    async def test_delete_instructor(self, auth_client, create_instructor):
        client, _ = auth_client
        instructor = await create_instructor()
        response = await client.delete(f"/instructors/{instructor.id}")
        assert response.status_code == 200

        follow_up = await client.get(f"/instructors/{instructor.id}")
        assert follow_up.json() is None

    async def test_delete_nonexistent_instructor(self, auth_client):
        client, _ = auth_client
        response = await client.delete("/instructors/999999")
        assert response.status_code == 404
