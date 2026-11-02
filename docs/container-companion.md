# Container companion source

The repository includes a runtime Dockerfile and tracked Compose configuration. This is prepared source, **not a delivered or verified container companion**: this execution environment has neither Docker nor Podman, no container image has been published, and no native hosting wizard has been built or exercised.

## Intended build

Build and verify the static artifact first. The container copies only that artifact and the repository-owned server, not Git metadata, credentials or browser storage. Its official Node base is pinned to a registry-confirmed immutable image index digest. It runs as the unprivileged `node` user.

```sh
npm test
npm run check
npm run build
docker build --tag feature-workbench:local .
```

A production registry tag or digest must be verified before setting `WORKBENCH_IMAGE`. Compose deliberately refuses to start with an unset image instead of claiming a nonexistent published package exists. No credential belongs in Compose or this repository.

## Networking and data

The server binds inside the container. Compose defaults to host loopback, so it does not silently expose the user's data or machine to a LAN. An authorized LAN deployment sets `WORKBENCH_BIND` to the intended host interface and `WORKBENCH_PORT` to the selected host port. Do not change firewall rules or enable public-Internet exposure to make a check pass.

Visitor data still belongs to each visitor's browser profile. The container has a read-only filesystem, no host mounts, and no server-side task database. Stopping it does not delete browser state.

## Pending proof

Before describing this companion as delivered, verify image build, immutable registry publication, Compose pull/start, health, exact source provenance, both native hosting modes, the tailored portable setup wizard and the complete URL from an intended LAN client. A container-internal probe alone does not establish LAN reachability. The hosted public documentation remains available independently.
