<p align="center">
  <img src="./public/logo.png" lt="Logo" width="65" />
<p>

# Offlimate

<p align="center">
  <a href="https://shirsendu-bairagi.betteruptime.com">
    <img src="https://uptime.betterstack.com/status-badges/v3/monitor/10aqw.svg" alt="uptime status">
  </a>
</p>

![Landing](public/previews/landing.webp)

> Offline Meetup Event Booking Platform

- 📦 SSR
- 🖼️ OG Tags
- 🚀 PWA
- ✋ Push Notification
- 🌙 Light/Dark Mode
- 🐋 Containerized
- 🪄 CI/CD (Github Action)
- 🎭 Authentication (OAuth 2.0)
- ⚡️ API Route Caching
- 📐 Analytics

## How to Deploy

1. Initialize Swarm on the Manager Node

```bash
docker swarm init --advertise-addr <MANAGER-IP>
```

2. Join Worker Nodes to the Swarm

```bash
docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
```

3. Check Node Status

```bash
docker node ls
```

4. Create a docker volume

```bash
docker volume create \
  --name offlimate_static \
  --driver local \
  --opt type=none \
  --opt device=~/shba007/offlimate/static \
  --opt o=bind
```

5. Use Docker Stack to deploy multi-container application

```bash
docker stack deploy --compose-file docker-compose.prod.yml offlimate
```

6. Scale service

```bash
docker service scale offlimate_app=2
```

7. Verify

```bash
docker service ls
docker service ps offlimate_app
```

## License

Published under the [MIT](https://github.com/shba007/offlimate/blob/main/LICENSE) license.
<br><br>
<a href="https://github.com/shba007/offlimate/graphs/contributors">
<img src="https://contrib.rocks/image?repo=shba007/offlimate" />
</a>
