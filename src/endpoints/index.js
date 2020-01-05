import routeLoader from 'endpoints/route-loader';

class Endpoints {
    loadRoutes(server) {
        const routes = routeLoader.load();
        this.routes = routes;
        routes.forEach((route) => {
            if (server[route.httpMethod]) {
                const callbacks = route.middlewareCallbacks.map(item => item.cb);
                server[route.httpMethod]({
                    path: route.path,
                    version: route.version
                }, callbacks);
            }
        });
    }
}

export default new Endpoints();
