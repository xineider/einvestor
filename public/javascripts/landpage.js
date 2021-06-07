$(document).ready(function () {
	console.log('estou no ready do landpage');

	$(document).on('change','.investe-renda-variavel',function(e){
		e.preventDefault();
		console.log('estou alterando o radio');

		console.log($(this).val());

		if($(this).val() == 'sim'){
			$('.container_pretencao_investimento').removeClass('none');

			console.log('is checked');
			console.log($('.pretencao_investimento').is(':checked'));

			//se o pretencao_investimento estiver checkado e o usuário mudar para o sim deve aparecer o botão

			if($('.pretencao_investimento').is(':checked')){
				$('.btn-continuar-conhecer').removeClass('none');
			}else{
				$('.btn-continuar-conhecer').addClass('none');
			}
		}else{
			$('.container_pretencao_investimento').addClass('none');
			$('.btn-continuar-conhecer').removeClass('none');
		}




	});


	$(document).on('change','.pretencao_investimento',function(e){
		e.preventDefault();
		console.log('estou alterando a pretencao investimento');
		console.log($(this).val());

		$('.btn-continuar-conhecer').removeClass('none');

	});


	$(document).on('click','.whatsapp-popup',function(e){
		e.preventDefault();
		$('.whatsapp-popup-box').toggleClass('active');
	});

	$(document).on('click','.whatsapp-popup-box-header-close',function(e){
		e.preventDefault();
		$('.whatsapp-popup-box').removeClass('active');
	})


	$(document).on('click','.btn-toggle-p-fisica',function(e){
		e.preventDefault();
		$(this).addClass('active');
		$('.btn-toggle-p-juridica').removeClass('active');
		LoadTo('/carregar_formulario_pessoa_fisica', 'container_data_token');
	});

	$(document).on('click','.btn-toggle-p-juridica',function(e){
		e.preventDefault();
		$(this).addClass('active');
		$('.btn-toggle-p-fisica').removeClass('active');
		LoadTo('/carregar_formulario_pessoa_juridica', 'container_data_token');
	});


	// $(document).on('change','.prosseguir_escolha_pessoa_fisica_juridica_radio',function(e){
	// 	e.preventDefault();
	// 	console.log('estou alterando a pretencao investimento');
	// 	console.log($(this).val());

	// 	if($(this).val() == 'pessoa_fisica'){
	// 		console.log('é pessoa fisica');
	// 		LoadTo('/carregar_formulario_pessoa_fisica', 'container_formulario_conhecer_cliente');
	// 	}else if($(this).val() == 'pessoa_juridica'){
	// 		LoadTo('/carregar_formulario_pessoa_juridica', 'container_formulario_conhecer_cliente');
	// 	}



	// });


	$(document).on('click','.btn-toggle-j-empresa',function(e){
		e.preventDefault();
		$('.btn-toggle-j-land').removeClass('active');
		$(this).addClass('active');
		LoadToChangeLandpage('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica','.titulo_opcao_juridico','Nome da Empresa');
	});


	$(document).on('click','.btn-toggle-j-banco',function(e){
		e.preventDefault();
		$('.btn-toggle-j-land').removeClass('active');
		$(this).addClass('active');
		LoadToChangeLandpage('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica','.titulo_opcao_juridico','Nome do Banco');
	});

	$(document).on('click','.btn-toggle-j-gestora',function(e){
		e.preventDefault();
		$('.btn-toggle-j-land').removeClass('active');
		$(this).addClass('active');
		LoadTo('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica');
		LoadToChangeLandpage('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica','.titulo_opcao_juridico','Nome da Gestora de Investimentos');
	});

	$(document).on('click','.btn-toggle-j-fundo',function(e){
		e.preventDefault();
		$('.btn-toggle-j-land').removeClass('active');
		$(this).addClass('active');
		LoadToChangeLandpage('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica','.titulo_opcao_juridico','Nome do Fundo de Investimentos');
	});

	$(document).on('click','.btn-toggle-j-outro',function(e){
		e.preventDefault();
		$('.btn-toggle-j-land').removeClass('active');
		$(this).addClass('active');
		LoadToChangeLandpage('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica','.titulo_opcao_juridico','Nome da Empresa');
	});




	$(document).on('change','.pessoa_juridica_opcoes',function(e){
		e.preventDefault();
		console.log('estou alterando a pessoa_juridica_opcoes');
		console.log($(this).val());


		if($(this).val() == 'empresa' || $(this).val() == 'outro'){
			LoadTo('/carregar_formulario_empresa', 'formulario_container_pessoa_juridica');
		}




	});





});



function LoadToChangeLandpage(link, to,element,change,) {
	$.ajax({
		method: "GET",
		async: true,
		url: link,
		beforeSend: function(request) {
			request.setRequestHeader("Authority-Moon-hash", $('input[name="hash_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-id", $('input[name="id_usuario_sessao"]').val());
			request.setRequestHeader("Authority-Moon-nivel", $('input[name="nivel_usuario_sessao"]').val());
			adicionarLoader();
			console.log('estou no loadToChangeLandpage')
		},
		success: function(data) {
			$('.'+to).empty();
			$('.'+to).append(data);
			LogSistema('GET',link);
		},
    error: function(xhr) {
    },
    complete: function() {
    	removerLoader();
    	$('.material-tooltip').remove();
    	$('.tooltipped').tooltip({delay: 50});
    	$(element).text(change);
    	//$('.modal').modal('close');
    	FormatInputs();
    }
});
}

