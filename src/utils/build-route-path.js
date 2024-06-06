export function buildRoutePath(path){
    const routeParametersRegex = /:([a-zA-Z]+)/g 
    // Regex que captura qualquer parâmetro dinâmico na forma ":param" na rota, como ":id" em /users/:id

    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<id>[a-z0-9\-_]+)') 
    // Substitui todos os parâmetros dinâmicos na rota pelo padrão de captura, permitindo valores alfanuméricos, hífens e sublinhados
    // Exemplo: "/users/:id" se torna "/users/(?<id>[a-z0-9\-_]+)"

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
    // Cria uma nova expressão regular que começa com o início da string e inclui a rota transformada

    return pathRegex
}
