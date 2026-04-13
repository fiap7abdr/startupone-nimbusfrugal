---
shaping: true
---

# Nimbus Frugal — Frame

## Source

> Plataforma FinOps SaaS multi-tenant para AWS com atualizacao diaria e foco em visibilidade, priorizacao e governanca operacional.
>
> Controle de custos em nuvem, inteligencia para economizar.
>
> Nimbus Frugal roda em conta AWS propria. Cada tenant cria IAM Role na propria AWS via CloudFormation. Trust policy referencia o AWS Account ID da Nimbus com External ID unico. Coleta assincrona em batch a cada 24h. Dados nao sao real-time — freshness sempre exibido.
>
> Escopo inicial enxuto: Bootstrap, Landing/Signup, AWS Onboarding, Tenant App, Global Admin Panel.
> 3 perfis de acesso: Admin Geral, Owner do Tenant, Read.
> 18 entidades minimas. 7 conectores iniciais.
> Autenticação exclusivamente via Google OAuth (sem magic link/email).

> Cada conector deve ter sua role com sua policy focada em least privilege.

> Um cliente da nimbus frugal pode ser membro de mais de uma empresa. Na versao trial pode apenas uma empresa, na versao pro pode ser varias empresas.

> Ao clicar no botao de upgrade para o pro, o usuario e levado a uma tela onde ele consente do novo modelo de cobranca.

> A pagina de onboarding e integracoes devem ser mescladas. La sera possivel gerenciar (adicionar/remover) quantas AWS Organizations quiser. Dentro de cada AWS Organization, sera mostrado cada conector. Esse conector vai receber a role arn da conta administradora delegada (ou management) e sera informado o cloudformation para cada integracao.

> Na pagina do AWS Organization deve listar a estrutura de contas aws em modo de arvore, semelhante ao console de visualizacao do aws organizations da aws. Pode haver mais de uma AWS Organization configurada por Empresa.

> Pricing: TRIAL 90 dias tudo ilimitado; PRO 10% da economia estimada identificada pelas recomendacoes.

---

## Problem

- Empresas que usam AWS nao tem visibilidade centralizada e acionavel sobre seus custos multi-conta (implied by source: "foco em visibilidade, priorizacao e governanca operacional")
- As ferramentas nativas da AWS (Cost Explorer, Trusted Advisor, Compute Optimizer) sao fragmentadas, exigem navegacao manual entre contas e nao priorizam oportunidades de economia de forma unificada (implied by landing page problem cards: EyeOff "sem visibilidade", Wrench "ferramentas fragmentadas", Brain "sem priorizacao")
- Nao existe uma camada SaaS acessivel que consolide essas fontes (AWS Organizations, CUR, Cost Explorer, Cost Optimization Hub, Compute Optimizer, Trusted Advisor, SSM Explorer), organize por Organization/OUs, e apresente recomendacoes priorizadas com freshness transparente (implied by source: "freshness sempre exibido", 7 conectores cobrindo fontes distintas)
- Empresas com multiplas AWS Organizations precisam gerenciar todas em um unico lugar (direct: "gerenciar quantas AWS Organizations quiser")

## Outcome

1. **Onboarding self-service** — tenant conecta multiplas AWS Organizations via CloudFormation, cada conector com IAM Role least-privilege e External ID unico
2. **Visibilidade consolidada** — dashboard unico com custos, recomendacoes e freshness de dados por conector
3. **Priorizacao inteligente** — recomendacoes de economia agregadas de 7 conectores AWS (Organizations, CUR, Cost Explorer, Cost Optimization Hub, Compute Optimizer, Trusted Advisor, SSM Explorer), priorizadas por impacto estimado
4. **Governanca operacional** — arvore hierarquica de OUs/contas por Organization (estilo console AWS), integracoes com health check, audit log
5. **Multi-tenancy com planos** — Trial (1 empresa, 90 dias) e Pro (multiplas empresas, upgrade com consentimento)
6. **Modelo de negocio baseado em valor** — pricing Pro cobra 10% da economia estimada identificada pelas recomendacoes, alinhando incentivo da plataforma com resultado do cliente
7. **Admin global** — painel administrativo para gestao de tenants, batches, impersonation e convite de admins
