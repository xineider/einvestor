var mongoose = require('mongoose');

const relatorioSchema = new mongoose.Schema({
	titulo:String,
	estrategias:[{
		nome:String,
		net_profit:Number,
		drawdown:Number,
		trades:Number,
		profit_factor:Number,
		sharpe_ratio:Number,
		return:Number,
		average_trade:Number,
		year_average:Number,
		winning:Number,
		daily_profit:Number,
		month_profit:Number
	}],
	imagem:String,
	resume_performance:[{
		period:String,
		net_profit:Number,
		profit_factor:Number,
		trades:Number,
		wins:Number
	}],
	monthly_performance:[{
		year:String,
		jan:Number,
		fev:Number,
		mar:Number,
		apr:Number,
		may:Number,
		jun:Number,
		jul:Number,
		aug:Number,
		sep:Number,
		oct:Number,
		nov:Number,
		dec:Number,
		ytd:Number
	}],
	stats:[{
		win_loss_ratio:Number,
		payout_ratio:Number,
		average_of_bars:Number,
		ahpr:Number,
		z_score:Number,
		z_probability:Number,
		expectancy:Number,
		deviation:Number,
		exposure:Number,
		stagnation_days:Number,
		stagnation_percentage:Number
	}],
	trades:[{
		total_trades:Number,
		wins:Number,
		loss:Number,
		cancelled:Number,
		gross_profit:Number,
		gross_loss:Number,
		average_win:Number,
		average_loss:Number,
		largest_win:Number,
		largest_loss:Number,
		max_consec_wins:Number,
		max_consec_loss:Number,
		avg_consec_wins:Number,
		avg_consec_loss:Number
	}]
});

module.exports = mongoose.model('relatorio', relatorioSchema,'relatorio'); 