Local signing and submitting transaction can be done only with official JS library. \
So lets just call it from PHP with exec().

#### Call from PHP:

```php
    /**
     * @param string $recipient_address
     * @param int $xrp_drops XRP in drops where 1 XRP = 1,000,000 drops
     * @return array
     * @throws Exception
     */
    public function send($recipient_address, $xrp_drops)
    {
        $js_script_path = 'route\to\send-tx.js';
        $variables =
            '--sender_address=' . $this->address . ' ' .
            '--sender_secret=' . $this->secret . ' ' .
            '--recipient_address=' . $recipient_address . ' ' .
            '--send_amount=' . $xrp_drops . ' ' .
            '--wss_server=' . 'wss://s.altnet.rippletest.net:51233';

        $exec_string = 'node '.$js_script_path.' '.$variables.' 2>&1';
        $response = exec($exec_string, $out, $err);

        $json = json_decode($response);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid response');
        }

        return $json;
    }
```
[Get started with Ripple API](https://xrpl.org/get-started-with-rippleapi-for-javascript.html)