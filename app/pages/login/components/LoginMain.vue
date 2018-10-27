<template>
    <StackLayout ref="mainContainer" class="main-container">
        <Image src="~/assets/images/fpr-logo-full.png" width="200" horizontalalignment="center"/>

        <GridLayout ref="formControls" class="form-controls" rows="auto, auto">
            <TextField
                    hint="E-mail adres"
                    keyboardType="email"
                    returnKeyType="next"
                    @returnPress="focusPassword()"
                    v-model="user.email"
                    autocorrect="false"
                    autocapitalizationType="none"
                    row="0"></TextField>
            <TextField ref="password"
                       hint="Wachtwoord"
                       secure="true"
                       returnKeyType="done"
                       @returnPress="submit()"
                       v-model="user.password"
                       row="1"></TextField>

            <ActivityIndicator :busy="isAuthenticating" rowSpan="2"></ActivityIndicator>
        </GridLayout>

        <Button
                text="AANMELDEN"
                :isEnabled="!isAuthenticating"
                class="btn btn-secondary"
                @tap="submit()"></Button>

        <Label
                class="forgot-password"
                text="Wachtwoord vergeten?"
                horizontalalignment="center"
                @tap="forgotPassword()"></Label>

        <StackLayout ref="signUpStack" class="sign-up-stack" @tap="toggleDisplay()" translateY="50">
            <Label :text="isLoggingIn ? 'Sign up here' : 'Back to login'"></Label>
        </StackLayout>
    </StackLayout>
</template>

<script>
  import {prompt} from "tns-core-modules/ui/dialogs"
  import {connectionType, getConnectionType} from "tns-core-modules/connectivity"
  import alert from "~/utils/alert"
  import routes from "~/router";

  export default {
    name: 'login-main',
    props: {
      visible: true
    },
    data() {
      return {
        isLoggingIn: true,
        isAuthenticating: false,
        user: {
          email: "eddyverbruggen@gmail.com",
          password: "xs4all"
        }
      }
    },
    methods: {
      toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
      },
      focusPassword() {
        this.$refs.password.nativeView.focus();
      },
      submit() {
        this.isAuthenticating = true;
        this.login();
      },
      navigate() {
        this.$changeRoute('home', {clearHistory: true})
      },
      login() {
        if (getConnectionType() === connectionType.none) {
          alert("Om in te kunnen loggen is een internetverbinding vereist")
          return;
        }
        return this.$authService
          .login(this.user)
          .then(() => {
            this.isAuthenticating = false;
            this.$navigateTo(routes.home, {clearHistory: true});
            this.visible = false;
          })
          .catch(error => {
            this.isAuthenticating = false;
            console.error(error);
            if (error.indexOf("The password is invalid") > -1) {
              // user found
              alert("Dat wachtwoord lijkt niet te kloppen.\nProbeer het nog eens.");
            } else {
              // no user found
              prompt({
                title: "Bevestig je e-mail adres",
                defaultText: this.user.email,
                okButtonText: "Verder >",
                cancelButtonText: "Annuleren"
              }).then(data => {
                if (data.result && data.text && data.text.trim().length > 4) {
                  this.user.email = data.text.trim();
                  prompt({
                    title: `Bevestig je wachtwoord`,
                    message: `Voor je nieuwe account\n${this.user.email}`,
                    defaultText: this.user.password,
                    okButtonText: "Registreren",
                    cancelButtonText: "Annuleren"
                  }).then(data => {
                    if (data.result && data.text && data.text.trim().length > 0) {
                      console.log("data.result: " + JSON.stringify(data));
                      this.user.password = data.text.trim();
                      this.signUp();
                    }
                  });
                }
              });
            }
          });
      },
      signUp() {
        if (getConnectionType() === connectionType.none) {
          alert("Om te kunnen registreren is een Internetverbinding vereist")
          return;
        }
        this.$authService
          .register(this.user)
          .then(() => {
            alert("Je account is succesvol aangemaakt. Welkom!");
            this.login();
          })
          .catch(error => alert(error));
      },

      forgotPassword() {
        prompt({
          title: "Wachtwoord vergeten",
          message: "Voer je registratie e-mail in, zodat we je wachtwoord kunnen resetten",
          defaultText: "",
          okButtonText: "Reset!",
          cancelButtonText: "Annuleren"
        }).then(data => {
          if (data.result) {
            this.$authService
              .resetPassword(data.text.trim())
              .then(() => {
                alert("Je wachtwoord is succesvol gereset. We hebben je een e-mail gestuurd met verdere instructies.");
              })
              .catch(error => {
                console.log('Error resetting password: ' + error);
                alert("Helaas is er een fout opgetreden tijdens het resetten van je wachtwoord: " + error);
              })
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
    .login {
        .main-container {
            height: 425;
            margin-left: 30;
            margin-right: 30;
            border-radius: 10;
        }
        .main-label {
            horizontal-align: center;
            color: #131426;
        }
        .form-controls,
        .sign-up-stack {
            /*opacity: 0;*/
        }
        Image {
            margin-top: 5;
            margin-bottom: 20;
        }
        Button,
        TextField {
            margin-left: 16;
            margin-right: 16;
            margin-bottom: 10;
            border-radius: 2;
        }
        TextField {
            color: #131426;
            placeholder-color: #ACA6A7;
            margin-bottom: 10;
            &.light {
                color: #C4AFB4;
                placeholder-color: #C4AFB4;
            }
        }
        .submit-button {
            background-color: #F5D1E9;
            color: #131426;
            margin-top: 15;
            border-radius: 10;
        }
        .forgot-password {
            font-size: 13;
            /*margin-left: 20;*/
            /*margin-bottom: 45;*/
            color: #888888;
            text-align: center;
            margin-top: 6;
        }
        .sign-up-stack {
            background-color: #66A59A;
            label {
                width: 100%;
                color: white;
                horizontal-align: center;
                text-align: center;
                font-size: 15;
                height: 50;
            }
        }
    }

    .platform-ios .login {
        .main-container {
            width: 300;
        }
        .main-label {
            color: #131426;
            font-size: 32;
            margin-top: 45;
            margin-bottom: 52;
            letter-spacing: 0.2;
        }
        TextField {
            /*border-width: 1;*/
            /*border-color: #131426;*/
            margin-bottom: 20;
            &.light {
                /*border-color: #C4AFB4;*/
            }
        }
        .submit-button {
            height: 40;
        }
    }

    .platform-android .login {
        .main-container {
            width: 275;
            height: 394;
        }
        .main-label {
            font-size: 28;
            margin-top: 42;
            margin-bottom: 32;
            letter-spacing: 0.3;
        }
        .sign-up-stack label {
            margin-top: 15;
            text-transform: uppercase;
        }
        .forgot-password {
            font-size: 13;
            text-transform: uppercase;
        }
    }
</style>