/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, { useLayoutEffect } from 'react';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme, Text } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function TermsOfService({ navigation }) {
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={() => navigation.pop()}
        >
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <Text style={styles.text}>
        Ova aplikacija isključivo služi za učenje, te nije povezana ni sa jednom policijskom
        agencijom, organom ili institucijom. Pitanja i odgovori koji se nalaze u aplikaciji su rezultat
        rada trećih osoba koje nisu zaposlene u policijskim agencijama, niti učestvuju u kreiranju
        konkursa, testova i ostalog povezanog sa konkursnom procedurom bilo koje policijske
        agencije.

      </Text>
      <Text style={{ ...styles.text, marginVertical: 20 }}>
        Kreatori aplikacije
        GARANTUJU SAMO ZA PITANJA I ODGOVORE MUP-ova KOJI SU OBJAVILI LISTU
        PITANJA NA SVOJIM ZVANIČNIM STRANICAMA.
      </Text>
      <Text style={styles.text}>
        Sva ostala pitanja su hipotetička i služe za lakše i jednostavnije učenje i razumijevanje
        konkursnog materijala.
        Autori aplikacije NE GARANTUJU da će pitanja obuhvaćena u aplikaciji biti i na zvaničnim
        testovima pojedinih kantonalnih MUP-ova i policijskih agencija (SIPA, Federalna uprava
        policije, Granična policija, Direkcija za koordinaciju policijskim tijelima).
        Autori garantuju da je u rješenju pitanja tačan samo jedan odgovor, te da su preostala dva
        odgovora hipotetička i moguće je da će oni biti različiti na pravom testu.
        Korištenjem ove aplikacije se slažete sa uslovima korištenja te nemate pravo pritužbi ukoliko
        pitanja iz aplikacije ne budu ista kao na konkursima, osim za pitanja koja su objavljena od
        strane MUP-ova na njihovim zvaničnim web stranicama.
      </Text>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        {'USLOVI KUPOVINE \n\n'}
        Ovim se uslovima utvrđuje postupak naručivanja, plaćanja, isporuke te reklamacija usluga koje su
        ponuđene na ovoj aplikaciji. Trgovac je OD NEA, a kupac je posjetitelj aplikacije koji uzme premium
        paket, te izvrši plaćanje putem kreditnih kartica.
      </Text>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        {'NARUČIVANJE \n\n'}
        Kupac kupuje uslugu putem elektronskog obrasca. Kupcem se smatra svaka osoba koja elektronski
        popuni tražene podatke i uplati navedeni iznos od 34.99 KM. Cijena je izražena u Konvertibilnim
        markama, uključujući PDV. Usluga korištenja mobilne aplikacije nastupa u trenutku kada kupac
        odabere te potvrdi način plaćanja.
      </Text>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        {'PLAĆANJE \n\n'}
        Unutar naše aplikacije, implementirali smo najsigurniji online sistem plaćanja putem Monri
        platforme. Monri Payments d.o.o. je pružatelj e-commerce i POS – Point of Sale usluga (terminal za
        plaćanje) koji omogućava visokokvalitetne usluge u prihvatu i obradi transakcija elektronskim putem.
        Monri platforma je poznata kao vrlo često korišten sistem za online plaćanje, koji financijskim
        institucijama i trgovcima iz cijeloga svijeta nudi širok raspon jednostavnih, inovativnih i funkcionalno
        bogatih rješenja za obradu finansijskih transakcija. Plaćanje se vrši online jednom od kreditnih kartica:
        {'\n\n• VISA \n'}
        {'• MasterCard \n'}
        {'• Maestro \n\n'}
        Bez obzira koju bankovnu karticu posjedujete i kod koje banke, možete izvršiti plaćanje na našem
        online shopu uz visoku sigurnost plaćanja karticama.
        Mnogo više informacija i detalja o Monri platformi možete pročitati na njihovoj oficijelnoj
        stranici <Text onPress={() => Linking.openURL('https://www.monri.com')} style={{ textDecorationLine: 'underline', color: colors.primary }}>www.monri.com</Text>
      </Text>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        {'ISPORUKA \n\n'}
        Kada kupac odabere, te potvrdi način plaćanja automatski će mu biti omogućen pristup aplikaciji.
        Trgovac se obavezuje da će redovno vršiti ažuriranje materijala u skladu sa izmjenama i dopunama
        zakona.
      </Text>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        {'REKLAMACIJE \n\n'}
        Trgovac se obavezuje isporučiti aplikaciju koja je tehnički ispravna te odgovara opisu proizvoda
        navedenom unutar alplikacije.
        U slučaju da kupac ne može preuzeti proizvod, a tehnički problemi nisu vezani za trgovca, već su
        uzrokovani od strane kupca, operatera ili treće osobe trgovac ne snosi nikakvu odgovornost. Kupac
        nema pravo tražiti povrat novca u ovoj situaciji.
        Usluge koje Vam pruža trgovac kroz aplikaciju POLICE QUIZ ne uključuje troškove telefona, Internet
        prometa ili bilo koje druge troškove do kojih može doći.
        Iako Vam trgovac nastoji dati najbolju moguću ponudu usluge učenja kroz aplikaciju, trgovac ne
        može garantovati da će usluga odgovarati Vašim potrebama. Trgovac takođe ne može garantovati da
        će usluga biti bez grešaka. Ukoliko dođe do greške, molimo Vas da se javite na e-mail
        pocequizbih@gmail.com kako bismo je otklonili na najbrži mogući način.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: backgroundColor => ({
    padding: 20,
    backgroundColor,
  }),
  text: {
    fontSize: 16,
  },
  backButton: {
    marginLeft: 20,
  },
});

export default TermsOfService;
