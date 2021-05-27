const googleTrends = require('google-trends-api');
const moment = require('moment')
moment.locale('pt-br')

exports.getDailyTrends = async (req, res, next) => {

    let trendsByCountry = await googleTrends.dailyTrends({
        geo: 'BR',
        hl: 'PT-BR',
    })
    let promRes = await trendsByCountry;
    let todayTrends = []
    let todayData = ''

    JSON.parse(promRes).default.trendingSearchesDays.forEach(trend => {
        todayData = ({
            formattedDate: trend.formattedDate,
        });
        trend.trendingSearches.forEach(t => {
            todayTrends.push(t)
        });
    });
    if (todayTrends.length > 0) {
        return res.json({ todayData, todayTrends })
    } else {
        return res.json(null)
    }
}

exports.getRealTimeTrends = async (req, res, next) => {

    let trendsRealTime = await googleTrends.realTimeTrends({
        geo: 'BR',
        category: req.query.category,
        hl: 'PT-BR',
    })
    let promRes = await trendsRealTime;
    let RealTimeTrends = []

    for (let i = 0; i < 3; i++) {
        if (JSON.parse(promRes).storySummaries.trendingStories[i]) {
            RealTimeTrends.push(JSON.parse(promRes).storySummaries.trendingStories[i])
        }
    }

    if (RealTimeTrends.length > 0) {
        return res.json(RealTimeTrends)
    } else {
        return res.json(null)
    }
}

exports.getInterestByRegion = async (req, res, next) => {

    let keyword = req.query.keyword || 'Acarajé'
    if (req.query.data) {
        startTime = new Date(req.query.data[0])
        endTime = new Date(req.query.data[1])
    } else {
        startTime = new Date('01-01-2004')
        endTime = new Date()
    }

    let trendsRealTime = await googleTrends.interestByRegion({
        keyword: keyword,
        startTime: startTime,
        endTime: endTime,
        geo: 'BR',
        hl: 'PT-BR',
    })
    let promRes = await trendsRealTime;
    let trendsRegion = []

    JSON.parse(promRes).default.geoMapData.forEach(r => {
        console.log(r)
        trendsRegion.push({
            keyword: keyword,
            name: r.geoName,
            value: r.value,
            startTime: moment(startTime).format("LL"),
            endTime: moment(endTime).format("LL")
        });
    })

    if (trendsRegion.length > 0) {
        return res.json(trendsRegion)
    } else {
        return res.json(null)
    }
}

