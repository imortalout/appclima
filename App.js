import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View, Image, FlatList, Dimensions, AsyncStorage } from 'react-native'

import NetInfo from '@react-native-community/netinfo'

const font = {
	time: 48,
	h1: 24,
	h2: 12,
}

const photos = {
	'1' :  require('./assets/1.png'),
	'1n' :  require('./assets/1n.png'),
	'2' :  require('./assets/2.png'),
	'2n' :  require('./assets/2n.png'),
	'2r' :  require('./assets/2r.png'),
	'2rn' :  require('./assets/2rN.png'),
	'3' :  require('./assets/3.png'),
	'3n' :  require('./assets/3n.png'),
	'3TM' :  require('./assets/3TM.png'),
	'4' :  require('./assets/4.png'),
	'4n' :  require('./assets/4n.png'),
	'4r' :  require('./assets/4r.png'),
	'4rn' :  require('./assets/4rn.png'),
	'4t' :  require('./assets/4t.png'),
	'4tn' :  require('./assets/4tn.png'),
	'5n' :  require('./assets/5n.png'),
	'5' :  require('./assets/5.png'), 
	'6' :  require('./assets/6.png'),
	'6n' :  require('./assets/6n.png'),
	'7' :  require('./assets/7.png'),
	'7n' :  require('./assets/7n.png'),
	'8' :  require('./assets/8.png'),
	'8n' :  require('./assets/8n.png'),
	'9' :  require('./assets/9.png'),
	'9n' :  require('./assets/9n.png'),
}

export default class App extends React.Component {

	state = {
		max: 0,
	}


	constructor(props){
    	super(props)

    	this.openData = this.openData.bind(this)
    	this.getData = this.getData.bind(this)
  	}

	async getProductsOff(){

	    var refThis = this

	    try {
	      let date = await AsyncStorage.getItem('data')
	      var dates = JSON.parse(date)
	      
	      refThis.openData(dates)

	    } catch (error) {
	    	console.log(error)
	    }
	}

	openData(data){
		var typeTime = ''

	    var first = data[0]

	    var imageNow = first.text_icon.icon.day
	    var humidade = first.humidity
	    var vento = first.wind

	    var madruga = first.temperature.dawn
	    var madrugaImage = first.text_icon.icon.dawn

	    var manha = first.temperature.morning
	    var manhaImage = first.text_icon.icon.morning

	    var tarde = first.temperature.afternoon
	    var tardeImage = first.text_icon.icon.afternoon

	    var noite = first.temperature.night
	    var noiteImage = first.text_icon.icon.night


	    var arrayDays = []
	    var arraySave = {}

	    for (var i = 0 ; i < data.length; i++) {
	    	var varNow = data[i]
	    	if(i != 0){
	    		arrayDays.push(varNow)
	    	} 
	    	arraySave[i] = varNow
	    }

	    const jsonValue = JSON.stringify(data)
	   	AsyncStorage.setItem('data', jsonValue)

	    this.setState({
	    	firstDay: first.date_br,
	    	max: first.temperature.max,
	    	min: first.temperature.min,
	    	phrase: first.text_icon.text.phrase.reduced,
	    	imageNow: photos[imageNow],
	    	maxH: humidade.max,
	    	minH: humidade.min,
	    	maxV: vento.velocity_max,
	    	minV: vento.velocity_min,
	    	maxMadru: madruga.max,
	    	minMadru: madruga.min,
	    	imageMadru: photos[madrugaImage],
	    	maxManha: manha.max,
	    	minManha: manha.min,
	    	imageManha: photos[manhaImage],
	    	maxTarde: tarde.max,
	    	minTarde: tarde.min,
	    	imageTarde: photos[tardeImage],
	    	maxNoite: noite.max,
	    	minNoite: noite.min,
	    	imageNoite: photos[noiteImage],
	    	arrayDays: arrayDays
	    })
	}

	async getData(){
		var refThis = this

		try {
		    let response = await fetch('http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/3477/days/15?token=a0f3a0bd8e425fa991f937efbf7a21e0', {
		        method : 'GET',
		        headers: {
		          Accept: 'application/json',
		          'Content-Type': 'application/x-www-form-urlencoded',
		        }
		    })
		    
		    let responseJson = await response.json()
		    var data = responseJson.data

		    refThis.openData(data)

	    } catch (error){
	      	console.log(error)
	    }
	}

	async componentDidMount(){

		var refThis = this

		NetInfo.fetch().then(state => {
		  if(state.isConnected === true){
		  	refThis.getData()
		  } else {
		  	console.log('false')
		  	refThis.getProductsOff()
		  }
		})
  }

	render(){

		const {
			max, firstDay, phrase, imageNow, min,
			maxH, minH, maxV, minV, maxMadru, minMadru, imageMadru,
			maxManha, minManha, imageManha,
			maxTarde, minTarde, imageTarde,
			maxNoite, minNoite, imageNoite,
			arrayDays
		} =  this.state

		return(
			<View style={styles.container}>
				<StatusBar style="auto" />
				<Text style={styles.date}>Hoje, {firstDay}</Text>
				<View style={styles.header}>
					<View style={styles.contheader}>
						<Text style={styles.title}>São Paulo</Text>
						<Text style={styles.subtitle}>{phrase}</Text>
					</View>
					<View style={styles.contime}>
						<View style={styles.time}>
							<Text style={styles.subtitle}>Max</Text>
							<Text style={styles.max}>{max}º</Text>
						</View>
						<View style={styles.time}>
							<Text style={styles.subtitle}>Min</Text>
							<Text style={styles.title}>{min}º</Text>
						</View>
					</View>
		      	</View>
		      	<View style={styles.viewHm}>
		      		<Image style={styles.imageHm} contain={'cover'} source={imageNow}/>
		      		<Text>Humidade: {maxH}% - {minH}%</Text>
		      		<Text>Vento: {maxV}km/h - {minV}km/h</Text>
		      	</View>
		      	<View style={styles.viewTimes}>
		      		<View>
		      			<Text>Madru</Text>
		      			<Image style={styles.imageSec} contain={'cover'} source={imageMadru}/>
		      			<Text>{maxMadru}º</Text>
		      			<Text>{minMadru}º</Text>
		      		</View>
		      		<View>
		      			<Text>Manhã</Text>
		      			<Image style={styles.imageSec} contain={'cover'} source={imageManha}/>
		      			<Text>{maxManha}º</Text>
		      			<Text>{minManha}º</Text>
		      		</View>
		      		<View>
		      			<Text>Tarde</Text>
		      			<Image style={styles.imageSec} contain={'cover'} source={imageTarde}/>
		      			<Text>{maxTarde}º</Text>
		      			<Text>{minTarde}º</Text>
		      		</View>
		      		<View>
		      			<Text>Noite</Text>
		      			<Image style={styles.imageSec} contain={'cover'} source={imageNoite}/>
		      			<Text>{maxNoite}º</Text>
		      			<Text>{minNoite}º</Text>
		      		</View>
		      	</View>
		      	<View style={styles.separator}></View>
		      	<FlatList
                    data={arrayDays}
                    persistentScrollbar={true}
                    style={styles.list}
                    contentContainerStyle={styles.containerlist}
                    renderItem={({ item }) => (
                        <View>
                        	<Text style={styles.dateList}>{item.date_br}</Text>
                        	<View style={styles.viewDate}>
                            	<View>
                            		<Text>Madru</Text>
                            		<Text>{item.temperature.dawn.max}º</Text>
                            		<Text>{item.temperature.dawn.min}º</Text>
                            	</View>
                            	<View>
                            		<Text>Manha</Text>
                            		<Text>{item.temperature.morning.max}º</Text>
                            		<Text>{item.temperature.morning.min}º</Text>
                            	</View>
                            	<View>
                            		<Text>Tarde</Text>
                            		<Text>{item.temperature.afternoon.max}º</Text>
                            		<Text>{item.temperature.afternoon.min}º</Text>
                            	</View>
                            	<View>
                            		<Text>Noite</Text>
                            		<Text>{item.temperature.night.max}º</Text>
                            		<Text>{item.temperature.night.min}º</Text>
                            	</View>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    />
		    </View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingRight: 25,
    paddingLeft: 25
  },
  date : {
  	marginBottom: 24,
  	textAlign: 'left',
  	width: '100%'
  },
  header: {
  	width: '100%',
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	alignItems: 'center',
  	height: 70,
  },
  contheader: {
  	width: '60%',
  	height: '100%',
  	justifyContent: 'space-between',
  },
  title : {
  	fontSize: font.h1,
  	marginBottom: 6,
  },
  subltitle : {
  	fontSize: font.h2
  },
  contime : {
  	flexDirection: 'row',
  	flexWrap: 'wrap',
  	alignItems: 'flex-end',
  	justifyContent: 'flex-end',
  	width: '40%',
  },
  viewHm : {
  	width: '100%', 
  	alignItems: 'flex-start', 
  	marginTop: 30
  },
  imageHm : {
  	width: 50, 
  	height: 50, 
  	marginBottom: 12,
  	marginTop: 12
  },
  max : {
  	marginLeft: 20,
  	fontSize: font.time	
  },
  time: {
  	width: '100%',
  	alignItems: 'flex-end'
  },
  imageSec: {
  	width: 30, height: 30, marginBottom: 12
  },
  viewTimes: {
  	flexDirection: 'row', 
  	width: '100%', 
  	justifyContent: 'space-between', 
  	marginTop: 24
  },
  separator: {
  	width: '100%', 
  	height: 2, 
  	backgroundColor: '#C4C4C4', 
  	marginTop: 24
  },
  list : {
  	width: '100%'
  },
  containerlist : {
  	marginTop: 12,
	paddingBottom: 120
  },
  dateList : {
  	marginTop: 24,
  	opacity: 0.5,
  },
  viewDate : {
  	flexDirection: 'row', 
  	width: '100%',
  	justifyContent: 'space-between', 
  	marginTop: 12
  }
});
