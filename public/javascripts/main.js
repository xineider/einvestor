// Eventos DOM
var parar_timer = false;
var intervalo = '';






$(document).ready(function () {

	console.log('estou aqui no ready do começo');
	FormatInputs();
	LogSistema('GET','/plataforma/sistema');


	$(document).ajaxError(function () {
		AddErrorAjax();
	});
	$(document).ajaxSuccess(function () {
		$('.error_ajax').fadeOut();
	});

	$(document).ajaxComplete(function () {
		validarDataTable($('#tabela_administracao'));
		validarDataTable($('#tabela_licenca_creditos'));
		validarTextAreaLined($('.textarea_lined'));
	});


	$(document).on('click', '.modal-remover-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var texto = $(this).data('texto');
		var id = $(this).data('id');
		var to = $(this).data('to');
		var back = $(this).data('back');
		var mensagem_sucesso = $(this).data('mensagem-sucesso');
		console.log('mensagem_sucesso:' + mensagem_sucesso);

		$(modal).modal();
		$(modal).find('#texto').text(texto);
		$(modal).find('#id').val(id);
		$(modal).find('.delete_button').data('href', to).data('action', back).data('mensagem-sucesso',mensagem_sucesso);
	});

	$(document).on('click', '.modal-mount', function (e) {
		e.preventDefault();
		var modal = $(this).data('modal');
		var link = $(this).data('link');

		console.log('cliquei no modal-mount');
		console.log('modal');
		console.log(modal);
		console.log('link');
		console.log(link);
		MountModal(modal, link);
	});


	$(document).on('click', '.modal-mount-check-form', function (e) {

		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();

		var modal = $(this).data('modal');
		var link = $(this).data('link');

		console.log('cliquei no modal-mount');
		console.log('modal');
		console.log(modal);
		console.log('link');
		console.log(link);

		console.log('form');
		console.log(form)

		if (VerificarForm(form) == true) {
			console.log('retornei true')
			MountModal(modal, link);
		}

	});







	$(document).on('click', '.ajax-load', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		console.log(link);
		GoTo(link, true);
	});


	$(document).on('click','.close-alerts-button',function(e){
		e.preventDefault();
		$('.alert').alert('close');
	});

	$(document).on('keyup',function(e){
		var keyCode = e.keyCode ? e.keyCode : e.which;
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
		console.log('o botão é: ' + keyCode);
		console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');


		if (keyCode == 44) {
			stopPrntScr();
		}
	});



	$(document).on('click', '.ajax-load-to', function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		var to = $(this).data('to');
		console.log('ajax-load-to to:' +to);
		console.log('ajax-load-to link: ' + link);
		LoadTo(link, to);
		$('.ajax-load-to').removeClass('active');
		$('#grafico_botao_tudo').removeClass('active');
		$(this).addClass('active');
	});

	$(document).on('click', '.ajax-load-to-btn', function(e) {
		e.preventDefault();
		var link = $(this).data('href');
		var to = $(this).data('to');
		console.log('ajax-load-to to:' +to);
		console.log('ajax-load-to link: ' + link);
		LoadTo(link, to);
		$('.ajax-load-to').removeClass('active');
		$('#grafico_botao_tudo').removeClass('active');
		$(this).addClass('active');
	});

	$(document).on('click', '.ajax-add-to', function(e) {
		e.preventDefault();
		var link = $(this).data('href');
		var to = $(this).data('to');
		AddTo(link, to);
	});

	$(document).on('click', '.remove', function (e) {
		e.preventDefault();
		$(this).closest('.pai').remove();
	});

	$(document).on('click', '.ajax-submit', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');

		console.log('form');
		console.log(form);
		console.log('post');
		console.log(post);
		if (VerificarForm(form) == true) {
			SubmitAjax(post, link, back);
		}
	});


	$(document).on('click', '.ajax-submit-form-other', function(e) {
		e.preventDefault();
		var form = $(this).data('form');
		var formulario = $(form).parents('form');
		var post = formulario.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var sucesso = $(this).data('sucesso-id');


		console.log('formulario');
		console.log(formulario);
		console.log('post');
		console.log(post);
		if (VerificarForm(formulario) == true) {
			SubmitAjaxSucessMessage(post, link, back,sucesso);
		}
	});


	$(document).on('click', '.ajax-submit-form-other-load-to', function(e) {
		e.preventDefault();
		var form = $(this).data('form');
		var formulario = $(form).parents('form');
		var post = formulario.serializeArray();

		var link = $(this).data('href');
		var back = $(this).data('action');
		var to = $(this).data('to');



		console.log('formulario');
		console.log(formulario);
		console.log('post');
		console.log(post);
		if (VerificarForm(formulario) == true) {
			SubmitAjaxLoadTo(post, link, to);
		}
	});


	$(document).on('click', '.ajax-submit-form-other-link', function(e) {
		e.preventDefault();
		var form = $(this).data('form');
		var formulario = $(form).parents('form');
		var post = formulario.serializeArray();


		var link_pagamento = $(this).data('link');

		var link = $(this).data('href');
		var back = $(this).data('action');


		console.log('link');
		console.log(link);

		console.log('link_pagamento');
		console.log(link_pagamento);

		console.log('formulario');
		console.log(formulario);
		console.log('post');
		console.log(post);
		if (VerificarForm(formulario) == true) {
			SubmitAjaxOpenLink(post, link, link_pagamento);
		}
	});


	$(document).on('click', '.ajax-submit-other-link', function(e) {
		e.preventDefault();

		var form = $(this).parents('form');
		var post = form.serializeArray();

		var link_pagamento = $(this).data('link');

		var link = $(this).data('href');
		var back = $(this).data('action');


		console.log('link');
		console.log(link);

		console.log('link_pagamento');
		console.log(link_pagamento);

		console.log('post');
		console.log(post);
		if (VerificarForm(form) == true) {
			SubmitAjaxOpenLink(post, link, link_pagamento);
		}
	});





	$(document).on('click', '.ajax-submit-no-back', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		if (VerificarForm(form) == true) {
			SubmitAjaxNoBack(post, link);
		}
	});

	$(document).on('click', '.btn-continuar-conhecer', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var element = $('.escolha_algoritmo');
		if (VerificarForm(form) == true) {
			SubmitLandpageConhecer(post, link,element);
		}
	});


	$(document).on('click','.btn-criar-usuario-landpage',function (e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		if (VerificarForm(form) == true) {
			SubmitAjaxLandPage(post, link);
		}



	});


	$(document).on('click', '.ajax-submit-change-element', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var element = $(this).data('element');
		console.log('clickei no submit change element');
		if (VerificarForm(form) == true) {
			SubmitAjaxChangeElement(post, link, element);
		}
	});




	$(document).on('click', '.ajax-submit-scroll-top', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		if (VerificarForm(form) == true) {
			SubmitAjaxScrollTop(post, link, back);
		}
	});






	$(document).on('click', '.ajax-submit-timer', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var conect_teste = $(this).data('conect_teste');
		if (VerificarForm(form) == true) {
			console.log('o que está indo de fato para o submit ajax de cor')
			SubmitAjaxTimer(post, link, back,conect_teste,15000);
		}
	});

	$(document).on('click', '.ajax-submit-load-to', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var to = $(this).data('to');
		var link = $(this).data('href');
		if (VerificarForm(form) == true) {
			SubmitAjaxLoadTo(post, link, to);
		}
		$('.ajax-load-to').removeClass('active');
		$('#grafico_botao_tudo').removeClass('active');
		$(this).addClass('active');
	});


	$(document).on('change', '#exibir_senha_primeiro_acesso', function(e) {
		e.preventDefault();
		if($('#exibir_senha_primeiro_acesso').is(':checked') == true){
			$('#automacao_senha_primeiro_acesso_corretora').attr('type','text');
		}else{
			$('#automacao_senha_primeiro_acesso_corretora').attr('type','password');
		}

	});

	$(document).on('change','.table-price-selector',function(e){
		e.preventDefault();
		console.log('estou alterando o table price selector');
		$('#valor_simulador_pitch').val('');
		$('#multiplicador_x_simulador_pitch').val(1);
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var to = $(this).data('to');
		var link = $(this).data('href');



		if (VerificarForm(form) == true) {
			SubmitAjaxLoadTo(post, link, to);
		}

	});

	$(document).on('change','.table-price-selector-no-limpar',function(e){
		e.preventDefault();
		console.log('estou alterando o table price selector');
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var to = $(this).data('to');
		var link = $(this).data('href');



		if (VerificarForm(form) == true) {
			SubmitAjaxLoadTo(post, link, to);
		}

	});


	$(document).on('change','#relatorio_porcentagem_reais',function(e){
		e.preventDefault();
		console.log('estou alterando o switch do relatorio');
		console.log($(this).val());

		console.log($(this).is(':checked'));

			//reais
			if($(this).is(':checked')){
				$('.relatorio_dado_perc').addClass('none');
				$('.relatorio_dado_real').removeClass('none');
			}else{
				$('.relatorio_dado_perc').removeClass('none');
				$('.relatorio_dado_real').addClass('none');
			}



		});





	$(document).on('change','.clean-container-message',function(e){
		e.preventDefault();
		console.log('estou alterando o clean container message');
		var clean = $(this).data('clean');
		var mensagem = $(this).data('clean-mensagem');
		$('.'+clean).empty();
		$('.'+clean).html('<div class="text-center">'+mensagem+'</div>');
	});


	$(document).on('click','.clean-container-input-message',function(e){
		e.preventDefault();
		console.log('estou alterando o clean container message do input');
		var clean = $(this).data('clean');
		var mensagem = $(this).data('clean-mensagem');
		$('.'+clean).empty();
		$('.'+clean).html('<div class="text-center">'+mensagem+'</div>');
	});




	var menu_fechado = false;


	$(document).on('click','.sidebar-toggle', function (e) {
		$(this).toggleClass('active');
		console.log('clickei no sidebar-toggle');

		$('#sidebar').toggleClass('menu_mobile');
		$('.overlay_menu').toggleClass('none');

		// $('#sidebar').toggleClass('shrinked');
		// $('.page-content').toggleClass('active');
		// $(document).trigger('sidebarChanged');

		// if ($('.sidebar-toggle').hasClass('active')) {
		// 	$('.navbar-brand .brand-sm').addClass('visible');
		// 	$('.navbar-brand .brand-big').removeClass('visible');
		// 	$(this).find('i').attr('class', 'fas fa-long-arrow-alt-right');
		// } else {
		// 	$('.navbar-brand .brand-sm').removeClass('visible');
		// 	$('.navbar-brand .brand-big').addClass('visible');
		// 	$(this).find('i').attr('class', 'fas fa-long-arrow-alt-left');
		// }
	});


	$(document).on('click','.sidebar-landpage-toggle', function (e) {
		e.preventDefault();
		console.log('clickei no sidebar-landpage-toggle');

		$('#sidebar').toggleClass('menu_mobile');
		$('.overlay_menu').toggleClass('none');


	});



	$(document).on('click','.overlay_menu', function (e) {
		$(this).addClass('none');
		$('#sidebar').removeClass('menu_mobile');

	});


	$(document).on('click', '.ajax-submit-timer-5', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var conect_teste = $(this).data('conect_teste');
		if (VerificarForm(form) == true) {
			console.log('o que está indo de fato para o submit ajax de cor')
			SubmitAjaxTimer(post, link, back,conect_teste,5000);
		}
	});

	$(document).on('click', '.ajax-submit-sucess-message', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var back = $(this).data('action');
		var sucesso = $(this).data('sucesso-id');
		if (VerificarForm(form) == true) {
			SubmitAjaxSucessMessage(post, link, back,sucesso);
		}
	});




	$(document).on('click','.alterar-conta-teste-conexao',function(e){
		$('#testar_conexao').prop('disabled',false);
		$('#testar_conexao').removeClass('disabled').addClass('btn-primary');
		$('#botao_iniciar_sistema').prop('disabled',true);
		$('#botao_iniciar_sistema').addClass('disabled').removeClass('btn-success');
		$('#caixa_alert_conectado').addClass('hide').removeClass('show');

		$('#form_operacional_entrada').prop('disabled',true);
		$('#form_operacional_limite_perda').prop('disabled',true);
		$('.form_operacional_tipo_conta').prop('disabled',true);
		$('#alterar_operacional_porcentagem').prop('disabled',true);

		$('#form_trader_qtd_usuarios').prop('disabled',true);
		$('#form_trader_liquidez').prop('disabled',true);

		$('.js-input-change-color').addClass('color-disabled');




	});



	$(document).on('change paste keyup','.input-text-email-senha',function(e){
		$('#testar_conexao').prop('disabled',false);
		$('#testar_conexao').removeClass('disabled').addClass('btn-primary');
		$('#botao_iniciar_sistema').prop('disabled',true);
		$('#botao_iniciar_sistema').addClass('disabled').removeClass('btn-success');
		$('#caixa_alert_conectado').addClass('hide').removeClass('show');

		$('#form_operacional_entrada').prop('disabled',true);
		$('#form_operacional_limite_perda').prop('disabled',true);
		$('.form_operacional_tipo_conta').prop('disabled',true);
		$('#alterar_operacional_porcentagem').prop('disabled',true);

		$('#form_trader_qtd_usuarios').prop('disabled',true);
		$('#form_trader_liquidez').prop('disabled',true);

		$('.js-input-change-color').addClass('color-disabled');



	});


	$(document).on('click', '.ajax-submit-close', function(e) {
		e.preventDefault();
		var data = {_id:''};
		console.log('data do ajax-submit-close');
		console.log(data);
		console.log('jjjjjjjjjjjjjjjjjjjjjjjjj');
		var link = $(this).data('href');
		var back = $(this).data('action');
		SubmitAjaxClean(data, link, back);
	});

	$(document).on('click', '.carregar_parametros_algoritmo', function(e) {
		e.preventDefault();
		console.log('carregar_parametros_algoritmo');


		var form = $(this).parents('form');
		var post = form.serializeArray();
		var to = $(this).data('to');
		var link = $(this).data('href');
		if (VerificarForm(form) == true) {
			SubmitAjaxLoadToProgressBar(post, link, to);
			$('.carregar_parametros_algoritmo').addClass('none');
			$('.header_formulario_parametros').addClass('none');

			$('.sincronizar_estrategia_otimizada').removeClass('none');
			$('.mensagem_algoritmo_carregado').removeClass('none');

			$('.nome_estrategia').html(post[0].value);
		}

	});




	$(document).on('change','.aceito-termos',function(e){
		e.preventDefault();
		var data_disabled = $(this).data('disabled');
		console.log('data_disabled: ' + data_disabled);
		console.log('estou alterando aceitar os termos');
		console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');

		if($(this).is(':checked')){
			console.log('entrei aqui no checked');
			$('.' + data_disabled).removeClass('btn-disabled').prop('disabled',false).addClass('btn-success-light');;
		}else{
			console.log('entrei aqui no não checked');
			$('.' + data_disabled).addClass('btn-disabled').prop('disabled',true).removeClass('btn-success-light');
		}

	});


	$(document).on('change','.aceito-termos-politica',function(e){
		var data_disabled = $(this).data('disabled');
		console.log('data_disabled: ' + data_disabled);
		console.log('estou alterando aceitar politica');
		console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');


		if($(this).is(':checked') && $('.aceito-termos-condicoes').is(':checked')){
			console.log('entrei aqui no checked');
			$('.' + data_disabled).removeClass('btn-disabled').prop('disabled',false).addClass('btn-success-light');;
		}else{
			console.log('entrei aqui no não checked');
			$('.' + data_disabled).addClass('btn-disabled').prop('disabled',true).removeClass('btn-success-light');
		}

	});

	$(document).on('change','.aceito-termos-condicoes',function(e){
		var data_disabled = $(this).data('disabled');
		console.log('data_disabled: ' + data_disabled);
		console.log('estou alterando aceitar politica');
		console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');


		if($(this).is(':checked') && $('.aceito-termos-politica').is(':checked')){
			console.log('entrei aqui no checked');
			$('.' + data_disabled).removeClass('btn-disabled').prop('disabled',false).addClass('btn-success-light');;
		}else{
			console.log('entrei aqui no não checked');
			$('.' + data_disabled).addClass('btn-disabled').prop('disabled',true).removeClass('btn-success-light');
		}

	});




	$(document).on('click', '.ajax-submit-open-modal', function(e) {
		e.preventDefault();
		var form = $(this).parents('form');
		var post = form.serializeArray();
		var link = $(this).data('href');
		var modal = $(this).data('modal');

		if (VerificarForm(form) == true) {
			console.log('ajax-submit-open-modal');
			SubmitAjaxOpenModal(post, link, modal);
		}
	});

	//se o valor do usuário for um parceiro ele deve retirar a "depedência" de um parceiro e criar um vazio

	$(document).on('change','#adicionar_usuario_nivel_select',function(){
		if($(this).val() == 2){
			$('.adicionar_usuario_parceiro_container').empty();
		}else{
			LoadTo('/plataforma/sistema/administracao/carregar-parceiros', 'adicionar_usuario_parceiro_container');
		}
	});


	$(document).on('change','#par_trader_escolha',function(){
		if($(this).val() != 0){

			if($('#tempo_expiracao_trader_escolha').val() > 0 && $('#tipo_trader_escolha').val() != null){
				$('.btn-trader-operation').removeClass('disabled');
				$('.btn-trader-operation').prop('disabled',false);

				$('#operacao_box_mensagem_escolha').removeClass('none');
				$('#operacao_par_escolha_label').text($("#par_trader_escolha option:selected").text());


				if($('#tipo_trader_escolha').val() == 'Binária'){
					$('#operacao_tempo_expiracao_escolha_label').text('+' + $('#tempo_expiracao_trader_escolha').val());
				}else{
					$('#operacao_tempo_expiracao_escolha_label').text($('#tempo_expiracao_trader_escolha').val() + 'M');

				}

				$('#operacao_tipo_escolha_label').text($('#tipo_trader_escolha').val());


			}
		}
	});

	$(document).on('change','#tipo_trader_escolha',function(){
		if($(this).val() != 0){
			$('#tempo_expiracao_trader_escolha').prop('disabled',false);
			if($(this).val() == 'Binária'){
				LoadTo('/plataforma/sistema/load-trader-opcoes-binarias', 'tempo_expiracao_trader_escolha');

			}else if($(this).val() == 'Digital'){
				LoadTo('/plataforma/sistema/load-trader-opcoes-digital', 'tempo_expiracao_trader_escolha');
			}

		}
	});

	$(document).on('change','#tempo_expiracao_trader_escolha',function(){
		if($(this).val() != 0){
			if($('#par_trader_escolha').val() != null && $('#tipo_trader_escolha').val() != null){
				$('.btn-trader-operation').removeClass('disabled');
				$('.btn-trader-operation').prop('disabled',false);

				$('#operacao_box_mensagem_escolha').removeClass('none');
				$('#operacao_par_escolha_label').text($("#par_trader_escolha option:selected").text());

				if($('#tipo_trader_escolha').val() == 'Binária'){
					$('#operacao_tempo_expiracao_escolha_label').text('+' + $('#tempo_expiracao_trader_escolha').val());
				}else{
					$('#operacao_tempo_expiracao_escolha_label').text($('#tempo_expiracao_trader_escolha').val() + 'M');

				}
				$('#operacao_tipo_escolha_label').text($('#tipo_trader_escolha').val());

			}
		}
	});









	$(document).on('change', 'input[type="file"]', function () {
		if($(this).val() != '') {
			UploadFile($(this));
		}
	});

	$(document).on('change','#alterar_operacional_porcentagem',function(){
		if($('#alterar_operacional_porcentagem').is(':checked')){
			console.log('está checkado');
			$('.label_percentual_real').text('%');
			// $('#form_operacional_entrada').addClass('porcentagem');
			// $('#form_operacional_entrada').attr('name','entrada_perc');
		}else{
			console.log('não está checkado');
			$('.label_percentual_real').text('R$');
			// $('#form_operacional_entrada').removeClass('porcentagem');
			// $('#form_operacional_entrada').attr('name','entrada_num');
		}
	});


	$(document).on('click','#botao_parar_sistema',function(e){
		e.preventDefault();
		parar_timer = true;
	});


	$('.navbar-toggler').on('click', function (e) {
		e.preventDefault();
		console.log('estou clicando no navbar-toggler')

		$('#sidebar').addClass('active');

		$('.overlay_menu').addClass('active');

	});

	$('#dismiss_sidebar, .overlay_menu').on('click', function () {
		fecharMenu();
	});




	$(document).on('submit', 'form', function(e) {
		e.preventDefault();
	});

	$(document).on('change', '.cep', function () {
		GetEndereco($(this).val(), $(this).closest('.row'));
	});



	window.onpopstate = function() {
		GoTo(location.pathname, false);
	};


});


// Eventos Após DOM

$(window).on('load', function() {
	console.log('removi o loader');
	removerLoader();
	FormatInputs();
});



// Funções
function adicionarLoader() {
	// $('body').css('overflow', 'hidden');
	$('#padrao-loader').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoader()');
}

function adicionarLoaderConectando() {
	// $('body').css('overflow', 'hidden');
	$('#conectando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderConectando()');
}

function adicionarLoaderTestando() {
	// $('body').css('overflow', 'hidden');
	$('#testando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderTestando()');
}

function adicionarLoaderDesconectando(){
	$('#desconectando-loader').removeClass('none').fadeIn('fast');
	console.log('estou sendo chamado, adicionarLoaderDesconectando()');
}

function removerLoader() {
	console.log('estou sendo chamado, a função de removerLoader');

	$('body').css('overflow', 'auto');
	$('#conectando-loader').addClass('none');
	$('#testando-loader').addClass('none');
	$('.loader').fadeOut('fast');
}

function GoTo(link, state) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {

			$('main').html(data);
			LogSistema('GET',link);
			$('.overlay_menu').addClass('none');
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}

function GoToNoLog(link, state) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {

			$('main').html(data);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}


function GoToSuccess(link, state,sucesso) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			console.log('setando');
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('requestHeader');
			console.log(request);
			console.log('D:D:D:D:D:D:')
		},
		success: function(data) {
			$('main').html(data);
			$(sucesso).removeClass('none');
			LogSistema('GET',link);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	console.log('estou no complete do GoTo');
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    	fecharMenu();
    }
});
	if (state == true) {
		window.history.pushState('Sistema Quorp', 'Sistema Quorp', link);
	}
}




function LoadTo(link, to) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			$('.'+to).empty();
			$('.'+to).append(data);
			LogSistema('GET',link);
		},
    error: function(xhr) { // if error occured
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	//$('.modal').modal('close');
    	FormatInputs();
    }
});
}

function AddTo(link, to) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			$('.'+to).append(data);
		},
    error: function(xhr) { // if error occured
    	removerLoader();
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	// $('.modal').modal('close');
    	FormatInputs();
    }
});
}



function FormatInputs(focus) {
	$('.cnpj').mask('00.000.000/0000-00', {reverse: true});
	$('.cpf').mask('000.000.000-00', {reverse: true});
	$('.rg').mask('AAAAAAAAAAAAA', {reverse: true});
	$('.porcentagem').mask('##0,00%', {reverse: true});
	$('.cep').mask('00000-000');
	$('.tel').mask('(00) Z0000-0000', {
		translation: {
			'Z': {
				pattern: /[0-9]/, optional: true
			}
		}
	});

	$(".batata").maskMoney({showSymbol:true, symbol:"R$", decimal:",", thousands:"."});



	$('.money2').mask('000.000.000.000.000', {reverse: true});

	$('.money').mask('000000000000000,00', {reverse: true});
	$('.milhao').mask("#.###.###,00");

	$('.data-sem-hora').mask('00/00/0000');
	$('.data-com-hora').mask('00/00/0000 00:00:00');
	$('.valicao_data').mask('99/99/9999 99:99:99');
	$('.hora').mask('00:00:00');
	validarDataTable($('.tabela_filtrada'));
	validarTextAreaLined($('.textarea_lined'));
	$('[data-toggle="tooltip"]').tooltip();
	$('.datepicker').datepicker({
		format:'dd/mm/yyyy',
		language:'pt-BR',
		autoclose:true
	});
}


function GetEndereco(cep, pai) {
	var link = 'https://viacep.com.br/ws/'+cep+'/json/ ';
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			adicionarLoader();
		},
		success: function(data) {
			console.log(data);
			if (data['erro'] == true) {
				alert('CEP não encontrado');
				$(pai).find('.uf').focus();
			} else {
				$(pai).find('.cidade').val(data['localidade']).focus();
				$(pai).find('.rua').val(data['logradouro']).focus();
				$(pai).find('.uf').val(data['uf']).focus();
				$(pai).find('.numero').focus();
			}
		},
    error: function(xhr) { // if error occured
    	alert("CEP não encontrado, utilize somente números");
    	$(pai).find('.uf').focus();
    },
    complete: function() {
    	removerLoader();
    }
});
}


function SubmitAjax(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
			console.log('erro ajax-submit');
			console.log(xhr);
		},
		complete: function() {
			removerLoader();
		}
	});
}



function SubmitAjaxOpenLink(post, link, url) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			adicionarLoader();
		},
		success: function(data) {
			window.open(url, '_blank').focus();

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	

			
		},
		error: function(xhr) { // if error occured
			console.log('erro ajax-submit');
			console.log(xhr);
		},
		complete: function() {
			removerLoader();
		}
	});
}




function SubmitAjaxChangeElement(post, link, element) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX CHANGE ELEMENT ---------');
			console.log(data);
			console.log('-------------------------------------');

			console.log('data.resultado: ' + data.resultado);

			console.log('element');
			console.log(element);

			$('#' + element).text(data.resultado);





			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			// if (typeof data == 'object' && data['error'] != null){
			// 	console.log('cai no erro');
			// 	console.log(data['element']);
			// 	console.log(data['texto']);
			// 	AddErrorTexto($(data['element']),data['texto']);	
			// }else if(data != undefined){
			// 	if(back != ''){

			// 	}
			// }
			//LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}


function SubmitAjaxNoBack(post, link) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
		},
		success: function(data) {
		},
		error: function(xhr) {
		},
		complete: function() {			
		}
	});
}



function SubmitAjaxLandPage(post, link) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			adicionarLoader();
		},
		success: function(data) {
			console.log('-------------------');
			console.log(data);
			console.log('retorno do valor do cadastro do usuario');

			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}

			if(data.usuario_criado == true){
				window.location.href = "/plataforma/sistema/automacao";
			}


		},
		error: function(xhr) {
			removerLoader();
		},
		complete: function() {	
			removerLoader();		
		}
	});
}








function SubmitAjaxScrollTop(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
					$("html, body").animate({ scrollTop: 0 }, "slow");
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}


function SubmitAjaxSucessMessage(post, link, back,sucesso) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoToSuccess(back, true,sucesso);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}





function SubmitAjaxTimer(post, link, back,conect_teste,timer) {

	var invalido = false;

	console.log('conect_teste:' + conect_teste);

	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());

			if(conect_teste == 'teste'){
				adicionarLoaderTestando();
			}else if(conect_teste == 'conectar'){
				adicionarLoaderConectando();
			}else if(conect_teste == 'desconectar'){
				adicionarLoaderDesconectando();
			}else{
				adicionarLoader();
			}
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);
				invalido = true;	
			}else if(data != undefined){
				console.log('estou sendo chamado por que deu certo !!!!');
				console.log('back:'+ back);
				if(back != ''){
					console.log('estou no back do sucess222');

					if(conect_teste == 'conectar'){
						$('#header_status_text').text('Conectando');
						$('#header_status_icon').removeClass('fa-times red-text');
						$('#header_status_icon').addClass('fa-sync fa-spin yellow-text darken-1');
					}
					$("html, body").animate({ scrollTop: 0 }, "slow");

					setTimeout(function(){
						GoTo(back, true);
					},timer);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			console.log('estou no complete');
			if(invalido == false){
				$("html, body").animate({ scrollTop: 0 }, "slow");
				setTimeout(function(){
					removerLoader();
				},timer);
			}else{
				removerLoader();
			}

		}
	});
}


function SubmitAjaxLoadTo(post, link, to) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAXLOADTO ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				$('.'+to).empty();
				$('.'+to).append(data);
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}


function SubmitAjaxLoadToProgressBar(post, link, to) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			$('.progress').removeClass('none');
			$('.mensagem_progress').removeClass('none');

			// adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA Progress Bar ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				$('.'+to).empty();
				

				for(var i=0;i<=99;i++){
					$('.progress-bar').css('width',i + '%');
				};


				setTimeout(function(){
					$('.progress-bar').css('width',100 + '%');
					$('.'+to).append(data);

				}, 2000);
				
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			console.log('ja entrei no complete');

			setTimeout(function(){
				$('.progress-bar').css('width','0%');
				$('.progress').addClass('none');
				$('.mensagem_progress').addClass('none');
			}, 3000);
			
			// removerLoader();
		}
	});
}




function SubmitAjaxClean(post, link, back) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				if(back != ''){
					GoTo(back, true);
				}
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {

		}
	});
}


function SubmitAjaxOpenModal(post, link,modal) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function(data) {
			console.log('----------- DATA SUBMITAJAX ---------');
			console.log(data);
			console.log('-------------------------------------');

			/*update tambem retorna objeto, então tenho que validar ele pelo error*/	
			if (typeof data == 'object' && data['error'] != null){
				console.log('cai no erro');
				console.log(data['element']);
				console.log(data['texto']);
				AddErrorTexto($(data['element']),data['texto']);	
			}else if(data != undefined){
				console.log('estou sendo chamado por que deu certo !!!!');
				$(modal).find('.modal-content').html(data);
				$(modal).modal('show');
			}
			LogSistema('POST',link);
		},
		error: function(xhr) { // if error occured
		},
		complete: function() {
			removerLoader();
		}
	});
}



function Reestruturar(str) {
	var i = 1;
	$('.'+ str +' > div').each(function () {
		$(this).data('num', ''+i+'');
		i += 1;
	});
	return i;
}
function ActiveMaterializeInput(focus) {
	if (focus != undefined && focus != 'undefined') {
		console.log(focus);
		focus.first().focus();
		return true;
	}
	$('main textarea:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
		}
	});
	$('main input:not(disabled)').each(function () {
		if ($(this).val() != '') {
			$(this).focus();
			$('main input:not([disabled]):not([type="hidden"])').first().focus();
		}
	});
}
function MountModal(modal, link) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			// adicionarLoader();
			console.log('estou no mountModal');
			console.log('link');
			console.log(link);
		},
		success: function(data) {
			console.log(link);
			$(modal).find('.modal-content').html(data);
			$(modal).modal('show');
		},
		error: function(xhr) { 	
    		// removerLoader();
    	},
    	complete: function() {
	    	// removerLoader();
	    	// FormatInputs();
	    }
	});
}



function MountModalPost(modal, link,post) {
	$.ajax({
		method: 'POST',
		async: true,
		data: post,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			// adicionarLoader();
			console.log('estou no mountModal');
			console.log('link');
			console.log(link);
		},
		success: function(data) {
			console.log(link);
			$(modal).find('.modal-content').html(data);
			$(modal).modal('show');
		},
		error: function(xhr) { 	
    		// removerLoader();
    	},
    	complete: function() {
	    	// removerLoader();
	    	// FormatInputs();
	    }
	});
}

function VerificarForm(form) {
	$('.error').remove();
	var qtdErros = 0;

	var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


	
	form.find('input:enabled:not([type="hidden"])[required="true"]').each(function(){
		console.log('tem + de um input');
		if(VerificaItem($(this)) == true) {
			console.log('cai aqui no 1° erro')
			qtdErros++;
		};
	});


	if($('#alterar_senha').val() != $('#confirmar_alterar_senha').val())
	{
		console.log('cai no segundo erro');
		console.log('qtdErros:'+qtdErros);
		AddErrorTexto($('#confirmar_alterar_senha'),'Senhas são diferentes');
		qtdErros++;
	}

	console.log('length');
	console.log($('#automacao_senha_corretora').length);

	if($('#automacao_senha_corretora').length > 0 && $('#automacao_senha_primeiro_acesso_corretora').length > 0){

		if($('#automacao_senha_corretora').val() == $('#automacao_senha_primeiro_acesso_corretora').val())
		{
			console.log('cai aqui no erro da corretora');
			console.log($('#automacao_senha_corretora').val());
			console.log('qtdErros:'+qtdErros);
			AddErrorTexto($('#automacao_senha_primeiro_acesso_corretora'),'A nova senha não pode ser igual a antiga.');
			qtdErros++;
		}else{
			if(!(mediumRegex.test($('#automacao_senha_primeiro_acesso_corretora').val()))) {
				AddErrorTexto($('#automacao_senha_primeiro_acesso_corretora'),'Por-favor colocar uma senha de pelo menos 6 dígitos com letras e números');
				qtdErros++;
			}

		}

	}

	if($('#nova_senha').val() != $('#confirmar_nova_senha').val())
	{
		console.log('cai no segundo erro');
		console.log('qtdErros:'+qtdErros);
		AddErrorTexto($('#confirmar_nova_senha'),'Senhas são diferentes');
		qtdErros++;
	}


	if($('#nova_senha').val() != undefined){
		console.log('estou caindo na nova senha');
		if(!(mediumRegex.test($('#nova_senha').val()))) {
			AddErrorTexto($('#nova_senha'),'Por-favor colocar uma senha de pelo menos 6 dígitos com letras e números');
			qtdErros++;
		}

	}

	form.find('input:enabled:not([type="hidden"])[required="true"][type="email"]').each(function(){
		if($(this).val()!= ''){
			if(!validateEmail($(this).val())){
				console.log('cai no terteiro erro');
				qtdErros++;
				AddErrorTexto($(this),'Email Incorreto!!');
			}
		}
	});
	
	form.find('textarea:enabled[required="true"]').each(function(){
		if(VerificaItem($(this)) == true) {
			console.log('cai no quarto erro');
			qtdErros++;
		};
	});
	
	form.find('select[required="true"]').each(function(){
		console.log('entrei no select para verificar se tem o required');
		console.log('this val');
		console.log($(this).val());
		console.log($(this).val() == null);
		if(VerificaItem($(this)) == true) {
			console.log('cai no quinto erro');
			qtdErros++;
		};
	});
	
	if(qtdErros > 0){
		return false;
	}else if(qtdErros <= 0){
		return true;
	}
}


function VerificaItem(isso) {
	if (isso.val() == '' || isso.val() === null) {
		AddError(isso);
		return true;
	}
}
function AddError(isso) {
	console.log(isso);
	isso.focus().addClass('observe-post').parent().append('<div class="error">Complete corretamente</div>');
}
function AddErrorAjax() {
	$('.error_ajax').fadeIn();
	location.reload();
}

function AddErrorTexto(isso,texto) {
	isso.focus().addClass('observe-post').parent().append('<div class="error text-center">'+texto+'</div>');
}

function UploadFile(isso) {
	var link = isso.data('href');
	var formData = new FormData();
	formData.append('arquivo', isso[0].files[0]);

	$.ajax({
		url: link,
		type: 'POST',
		data: formData,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
		},
		success: function (data) {
			$('.file-path').val('');
			isso.closest('.row').append('\
				<div class="col s12 m6 center-align relative pai">\
				<div class="card-panel grey lighten-4">\
				<input type="hidden" name="tarefa_arquivo[arquivo][]" value="'+data+'">\
				<button class="btn-floating btn waves-effect waves-light red close-button remove"><i class="fa fa-times" aria-hidden="true"></i></button>\
				<b>Arquivo: '+data+' <br>\
				</div>\
				</div>\
				');
			console.debug(data);
		},
		error: function (xhr, e, t) {
			console.debug((xhr.responseText));
		},
		complete: function() {
			removerLoader();
		}
	});
}

function validarDataTable(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePt(elemento);	
		}
	}
}

function validarDataTableNoSort(elemento){
	if($(elemento).length>0){
		/*Já existe a tabela então não há necessidade de criá-la(senão dá problema)*/
		if($.fn.dataTable.isDataTable(elemento)){
		}else{
			filtrarTabelaDataTablePtNoSort(elemento);	
		}
	}
}

function validarTextAreaLined(elemento){
	if($(elemento).length>0){
		if($(elemento).parent().hasClass('linedtextarea')){

		}else{
			$(elemento).linedtextarea();
		}
	}
}


function validateEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function LogSistema(metodo,rota){
	var ip;
	var arrayValores = [];

	console.log('typeof logSistema');
	console.log(typeof $('input[name="id_usuario_sessao"]').val());

	if(typeof $('input[name="id_usuario_sessao"]').val() != 'undefined'){

		$.getJSON("https://api.ipify.org/?format=json", function(e) {
			ip = e.ip;
			arrayValores = [ip,metodo,rota,navigator.userAgent,$('input[name="id_usuario_sessao"]').val()];

			$.ajax({
				url:'/plataforma/sistema/log',
				type:'POST',
				data:JSON.stringify(arrayValores),
				contentType: 'application/json', 
				beforeSend: function(request) {
				}
			});
		});

	}
}

function filtrarTabelaDataTablePt(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search primary-text'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}	
	});
}

function filtrarTabelaDataTablePtNoSort(tabela){
	$(tabela).DataTable({			
		"paging":   false,
		"aaSorting": [],
		"order": [],
		language:{
			"decimal":        ",",
			"emptyTable":     "Nenhum registro encontrado",
			"info":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
			"infoEmpty":      "Mostrando de 0 até 0 de 0 registros",
			"infoFiltered":   "(Filtrados de _MAX_ registros)",
			"infoPostFix":    "",
			"thousands":      ".",
			"lengthMenu":     "_MENU_ resultados por página",
			"loadingRecords": "Carregando...",
			"processing":     "Processando...",
			"search":         "Pesquisar: <i class='fa fa-search primary-text'></i> ",
			"searchPlaceholder":"Pesquisar",
			"zeroRecords":    "Nenhum registro encontrado",
			"paginate": {
				"first":      "Primeiro",
				"last":       "Último",
				"next":       "Próximo",
				"previous":   "Anterior"
			},
			"aria": {
				"sortAscending":  ": Ordenar colunas de forma ascendente",
				"sortDescending": ": Ordenar colunas de forma descendente"
			}
		}
	});

}




function fecharMenu(){
	$('#sidebar').removeClass('active');
	$('.overlay_menu').removeClass('active');
}




function stopPrntScr() {

	var inpFld = document.createElement("input");
	inpFld.setAttribute("value", ".");
	inpFld.setAttribute("width", "0");
	inpFld.style.height = "0px";
	inpFld.style.width = "0px";
	inpFld.style.border = "0px";
	document.body.appendChild(inpFld);
	inpFld.select();
	document.execCommand("copy");
	inpFld.remove(inpFld);
}
function AccessClipboardData() {
	try {
		window.clipboardData.setData('text', "Access   Restricted");
	} catch (err) {
	}
}
setInterval("AccessClipboardData()", 300);

