## rodar primeiro o backend
# o simulador rodar depois, porque precisamos fazer uns passos antes de roda-lo

rodar o backend
`docker-compose up backend --build`

criar usuario / fazer login se ja existir usuario cadastrado
usuario padrão: lailton@gmail.com, senha22 (isso ajuda porque o simulador ja esta com essas variaveis - vc pode mudar depois)

apos logado
crie um Device (isso é importante porque precisamos mandar seu Heartbeat [suas metricas])

Por favor crie uma regra (preciso que crie para que quando o Simulator rodar, a gente veja as notificações)

Simulator
pegar o DeviceID no front e adicionar na variavel `DEVICE_I` dentro do `docker-compose.yml` (isso é importante pois o simulador vai enviar o Hearbeat aleatoria para o Device escolhido)
[Nesse momento eu queria fazer outra coisa, criar um rota do Simulator e enviar por parametros os DeviceID, pra não precisar adicionar em variaveis, porem isso ia sair do que foi pedido]

Apos adicionando as variaveis, vamos rodar o simulator
`docker-compose up simulator --build`


