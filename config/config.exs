import Config

config :github_chat,
  ecto_repos: [GithubChat.Repo]

# Configures the endpoint
config :github_chat, GithubChatWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: GithubChatWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: GithubChat.PubSub,
  live_view: [signing_salt: "NoK1/4kz"]

# Configures the mailer
config :github_chat, GithubChat.Mailer, adapter: Swoosh.Adapters.Local
config :swoosh, :api_client, false

config :phoenix, :filter_parameters, [
  "first_name",
  "last_name",
  "code"
]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.0",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

config :tailwind,
  version: "3.0.23",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Use OAuth
config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, [default_scope: "read:user,user:email,read:org"]}
  ]

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_CLIENT_ID"),
  client_secret: System.get_env("GITHUB_CLIENT_SECRET")

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
