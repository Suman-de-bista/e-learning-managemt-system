class TestCreateCourse:
    async def test_create_course(self, auth_client, create_instructor):
        client, _ = auth_client
        instructor = await create_instructor()
        response = await client.post(
            "/courses/",
            json={
                "instructor_id": instructor.id,
                "title": "test",
                "level": "test",
                "duration_hours": 20,
            },
        )
        assert response.status_code == 200
        body = response.json()
        assert body["title"] == "test"
        assert body["instructor_id"] == instructor.id

    async def test_create_course_requires_auth(self, client, create_instructor):
        response = await client.post(
            "/courses/",
            json={
                "instructor_id": 1,
                "title": "test",
                "level": "test",
                "duration_hours": 20,
            },
        )
        assert response.status_code in (401, 403)


class TestListCoursesByInstructor:
    async def test_list_courses_for_instructor(self, auth_client, create_instructor, create_course):
        client, _ = auth_client
        instructor = await create_instructor()
        await create_course(instructor_id=instructor.id, title="test1")
        response = await client.get(f"/courses/{instructor.id}")
        assert response.status_code == 200
        body = response.json()
        assert body["total"] >= 1
        titles = [item["title"] for item in body["items"]]
        assert "test1" in titles

    async def test_search_courses(self, auth_client, create_instructor, create_course):
        client, _ = auth_client
        instructor = await create_instructor()
        await create_course(instructor_id=instructor.id, title="test2")
        response = await client.get(f"/courses/{instructor.id}", params={"search": "test2"})
        assert response.status_code == 200
        assert response.json()["total"] == 1


class TestGetCourse:
    async def test_get_course_by_id(self, auth_client, create_course):
        client, _ = auth_client
        course = await create_course()
        response = await client.get(f"/courses/course/{course.id}")
        assert response.status_code == 200
        assert response.json()["id"] == course.id


class TestUpdateCourse:
    async def test_update_course(self, auth_client, create_course):
        client, _ = auth_client
        course = await create_course()
        response = await client.patch(f"/courses/{course.id}", json={"title": "test2"})
        assert response.status_code == 200
        assert response.json()["title"] == "test2"

    async def test_update_course_no_fields(self, auth_client, create_course):
        client, _ = auth_client
        course = await create_course()
        response = await client.patch(f"/courses/{course.id}", json={})
        assert response.status_code == 400


class TestDeleteCourse:
    async def test_delete_course(self, auth_client, create_course):
        client, _ = auth_client
        course = await create_course()
        response = await client.delete(f"/courses/{course.id}")
        assert response.status_code == 200

        follow_up = await client.get(f"/courses/course/{course.id}")
        assert follow_up.json() is None

    async def test_delete_nonexistent_course(self, auth_client):
        client, _ = auth_client
        response = await client.delete("/courses/999999")
        assert response.status_code == 404
