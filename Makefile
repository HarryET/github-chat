# This can be substituted for any .env file loader or ignored if env is set another way!
server: 
	zenv -f .env -- mix phx.server

docker:
	docker run --name gh-chat-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres:14