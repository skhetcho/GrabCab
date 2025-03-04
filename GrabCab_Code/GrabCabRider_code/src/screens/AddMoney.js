
import React from 'react';
import { 
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList 
  } from 'react-native';
import { Header} from 'react-native-elements';
import { colors } from '../common/theme';
var { height } = Dimensions.get('window');
import  languageJSON  from '../common/language';
import { Currency } from '../common/CurrencySymbol';
import { CurrencyName } from '../common/CurrencySymbol';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class AddMoneyScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            amount:'5',
            qickMoney:[{amount:'5',selected:false},{amount:'10',selected:false},{amount:'20',selected:false},{amount:'50',selected:false},{amount:'100',selected:false}]
        }  
    }
    
    componentDidMount(){
       let getParamData= this.props.navigation.getParam('allData');
       if(getParamData){
        this.setState({allData:getParamData})
       }
      
    }

    quckAdd(index){
        let quickM = this.state.qickMoney;
        for(let i = 0; i<quickM.length;i++){
            quickM[i].selected = false;
            if(i == index){
                quickM[i].selected = true;
            }
        }
        this.setState({
            amount:quickM[index].amount,
            qickMoney:quickM
        })
    }

    payNow(){  
        var d = new Date();
        var time = d.getTime();
        let payData = {
            email: this.state.allData.email,
            amount: this.state.amount,
            order_id: time.toString(),
            name: 'Add Money',
            description:'Wallet Ballance',
            currency: CurrencyName,
            quantity: 1,
        }
      if(payData){
        this.props.navigation.navigate("paymentMethod",{
            payData:payData,
            allData:this.state.allData    
        });
      }
    }

    newData = ({ item , index}) => {
        return (
            <TouchableOpacity style={[styles.boxView,{backgroundColor:item.selected?colors.GREY.default:'#e6e6e6'}]} onPress={() => {this.quckAdd(index);}}><Text style={styles.quckMoneyText,{color:item.selected?'#fff':'#000'}} >{Currency}{item.amount}</Text></TouchableOpacity>
        )
    }

 
    //go back
    goBack(){
        this.props.navigation.goBack();
    }
  render() {
    const walletBar = height/4;
    return (
        <View style={styles.mainView}>
            <Header 
                backgroundColor={colors.GREY.default}
                leftComponent={{icon:'ios-arrow-back', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.goBack()} }}
                centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.add_money_tile}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{marginLeft:10, marginRight: 10}}
            />
            
            <View style={styles.bodyContainer}>
              <Text style={styles.walletbalText}>Grabcab Balance - <Text style={styles.ballance}>{Currency}{this.state.allData?this.state.allData.walletBalance.toFixed(2):''}</Text></Text> 
             
                <TextInput
                    style={styles.inputTextStyle}
                    placeholder={languageJSON.addMoneyTextInputPlaceholder}
                    keyboardType={'number-pad'}
                    onChangeText={(text) => this.setState({ amount: text })} 
                    value={this.state.amount}
                />
                <View style={styles.quickMoneyContainer}>
                    <ScrollView showsHorizontalScrollIndicator = {false} horizontal={true}>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.qickMoney}
                            renderItem={this.newData}
                            horizontal = {true}
                        />       
                    </ScrollView>
                </View>
                <TouchableOpacity
                  style={styles.buttonWrapper2}
                  onPress={() => {
                    this.payNow();
                  }}>
                  <Text style={styles.buttonTitle}>{languageJSON.add_money_tile}</Text>
                </TouchableOpacity>
              </View>
            </View>
    );
  }
}

const styles = StyleSheet.create({
    
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    
    mainView:{ 
        flex:1,
        backgroundColor: colors.WHITE, 
    } ,
    bodyContainer:{
        flex:1,
        flexDirection:'column',
        marginTop:10,
        paddingHorizontal:12
    },
    walletbalText:{
        fontSize:17
    },
    ballance:{
        fontWeight:'bold'
    },
    inputTextStyle:{ 
        marginTop:10,
        height:50,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        fontSize:30
     },
     buttonWrapper2: {
        marginBottom: 10,
        marginTop: 18,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        borderRadius: 8,
      },
      buttonTitle: {
        color: '#fff',
        fontSize: 18,
      },
      quickMoneyContainer:{
        marginTop:18,
        flexDirection:'row',
        paddingVertical:4,
        paddingLeft:4,
       },
       boxView:{
        height:40,
        width:60,
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center',
        marginRight:8
       },
      quckMoneyText:{
        fontSize: 16,
      }
    
});
