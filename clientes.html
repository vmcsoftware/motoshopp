<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Clientes - MotoShop Pro</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-dark bg-primary">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <span class="navbar-brand mb-0 h1 ms-2">
          <i class="bi bi-gear-fill"></i> MotoShop Pro
        </span>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="text-light d-none d-md-inline">
          <i class="bi bi-person-circle"></i> Admin
        </span>
        <button id="logoutBtn" class="btn btn-outline-light">
          <i class="bi bi-power"></i> Sair
        </button>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" id="sidebarMenu">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link" href="dashboard.html" data-section="dashboard">
                <i class="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="clientes.html" data-section="clientes">
                <i class="bi bi-people"></i> Clientes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="motos.html" data-section="motos">
                <i class="bi bi-bicycle"></i> Motos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" data-section="ordens">
                <i class="bi bi-tools"></i> Ordens de Serviço
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" data-section="produtos">
                <i class="bi bi-box-seam"></i> Produtos/Vendas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" data-section="relatorios">
                <i class="bi bi-graph-up"></i> Relatórios
              </a>
            </li>
            <li class="nav-item mt-3">
              <a class="nav-link" href="#" data-section="configuracoes">
                <i class="bi bi-gear"></i> Configurações
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main content -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
        <!-- Header da página -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="text-glow">
              <i class="bi bi-people"></i> Gerenciar Clientes
            </h2>
            <p>Cadastre e gerencie seus clientes</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#clienteModal">
              <i class="bi bi-plus-circle"></i> Novo Cliente
            </button>
            <button class="btn btn-outline-success" id="exportarBtn">
              <i class="bi bi-download"></i> Exportar
            </button>
          </div>
        </div>

        <!-- Filtros e busca -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input type="text" class="form-control" id="buscarCliente" placeholder="Buscar cliente...">
                </div>
              </div>
              <div class="col-md-3">
                <select class="form-select" id="filtroStatus">
                  <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" id="filtroOrdem">
                  <option value="nome">Ordenar por Nome</option>
                  <option value="data">Data de Cadastro</option>
                  <option value="ultima_visita">Última Visita</option>
                </select>
              </div>
              <div class="col-md-2">
                <button class="btn btn-outline-secondary w-100" id="limparFiltros">
                  <i class="bi bi-arrow-clockwise"></i> Limpar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estatísticas rápidas -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card text-white bg-success glow">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="card-title">Total de Clientes</h6>
                    <h3 class="mb-0" id="totalClientes">0</h3>
                  </div>
                  <div class="fs-2 opacity-75">
                    <i class="bi bi-people"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-white bg-info glow">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="card-title">Clientes Ativos</h6>
                    <h3 class="mb-0" id="clientesAtivos">0</h3>
                  </div>
                  <div class="fs-2 opacity-75">
                    <i class="bi bi-person-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-white bg-warning glow">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="card-title">Clientes VIP</h6>
                    <h3 class="mb-0" id="clientesVIP">0</h3>
                  </div>
                  <div class="fs-2 opacity-75">
                    <i class="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-white bg-secondary glow">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="card-title">Novos este Mês</h6>
                    <h3 class="mb-0" id="novosClientes">0</h3>
                  </div>
                  <div class="fs-2 opacity-75">
                    <i class="bi bi-person-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de clientes -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-table"></i> Lista de Clientes
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0" id="tabelaClientes">
                <thead class="table-dark">
                  <tr>
                    <th>
                      <input type="checkbox" id="selecionarTodos" class="form-check-input">
                    </th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Última Visita</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody id="corpoTabela">
                  <!-- Dados serão carregados dinamicamente -->
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted">
                Mostrando <span id="resultadosInfo">0-0 de 0</span> clientes
              </small>
            </div>
            <nav aria-label="Paginação">
              <ul class="pagination pagination-sm mb-0" id="paginacao">
                <!-- Paginação será gerada dinamicamente -->
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal de Cliente -->
  <div class="modal fade" id="clienteModal" tabindex="-1" aria-labelledby="clienteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clienteModalLabel">
            <i class="bi bi-person-plus"></i> Novo Cliente
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formCliente">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="nomeCliente" class="form-label">Nome Completo *</label>
                <input type="text" class="form-control" id="nomeCliente" required>
              </div>
              <div class="col-md-6">
                <label for="emailCliente" class="form-label">Email</label>
                <input type="email" class="form-control" id="emailCliente">
              </div>
              <div class="col-md-6">
                <label for="telefoneCliente" class="form-label">Telefone *</label>
                <input type="tel" class="form-control" id="telefoneCliente" required>
              </div>
              <div class="col-md-6">
                <label for="cpfCliente" class="form-label">CPF</label>
                <input type="text" class="form-control" id="cpfCliente" placeholder="000.000.000-00">
              </div>
              <div class="col-md-3">
                <label for="cepCliente" class="form-label">CEP</label>
                <div class="input-group">
                  <input type="text" class="form-control" id="cepCliente" placeholder="00000-000" maxlength="9">
                  <button class="btn btn-outline-secondary" type="button" id="buscarCep" title="Buscar CEP">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                <div class="invalid-feedback" id="cepError"></div>
              </div>
              <div class="col-md-9">
                <label for="enderecoCliente" class="form-label">Endereço</label>
                <input type="text" class="form-control" id="enderecoCliente">
              </div>
              <div class="col-md-6">
                <label for="bairroCliente" class="form-label">Bairro</label>
                <input type="text" class="form-control" id="bairroCliente">
              </div>
              <div class="col-md-4">
                <label for="cidadeCliente" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="cidadeCliente">
              </div>
              <div class="col-md-2">
                <label for="ufCliente" class="form-label">UF</label>
                <input type="text" class="form-control" id="ufCliente" maxlength="2">
              </div>
              <div class="col-md-6">
                <label for="statusCliente" class="form-label">Status</label>
                <select class="form-select" id="statusCliente">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="tipoCliente" class="form-label">Tipo de Cliente</label>
                <select class="form-select" id="tipoCliente">
                  <option value="pessoa_fisica">Pessoa Física</option>
                  <option value="pessoa_juridica">Pessoa Jurídica</option>
                </select>
              </div>
              <div class="col-12">
                <label for="observacoesCliente" class="form-label">Observações</label>
                <textarea class="form-control" id="observacoesCliente" rows="3"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="salvarCliente">
            <i class="bi bi-save"></i> Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação -->
  <div class="modal fade" id="confirmarModal" tabindex="-1" aria-labelledby="confirmarModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmarModalLabel">Confirmar Ação</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="confirmarTexto">
          Tem certeza que deseja realizar esta ação?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" id="confirmarAcao">Confirmar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Spinner -->
  <div id="loadingSpinner" class="d-none">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Firebase SDK v8 (compat) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
  
  <!-- Firebase Configuration -->
  <script src="js/firebase-config-fixed.js"></script>
  
  <!-- Scripts -->
  <script src="js/clientes.js"></script>
</body>
</html>
