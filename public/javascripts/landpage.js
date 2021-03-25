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


});


