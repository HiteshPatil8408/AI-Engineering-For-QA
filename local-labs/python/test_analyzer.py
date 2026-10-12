import unittest
from analyzer import analyze

class AnalyzerTests(unittest.TestCase):
    def test_empty_is_undefined(self):
        self.assertIsNone(analyze([])["pass_rate"])
    def test_rates_and_pure_input(self):
        records = [{"name":"a","status":"failed","duration":2.0},{"name":"b","status":"passed","duration":1.0}]
        self.assertEqual(analyze(records)["pass_rate"], 0.5)
        self.assertEqual(records[0]["name"], "a")
        self.assertEqual(analyze(records)["failure_frequency"], {"a":1})
    def test_invalid_contract(self):
        for duration in [-1, True, float("nan"), "1"]:
            with self.assertRaises(ValueError):
                analyze([{"name":"a","status":"failed","duration":duration}])

if __name__ == "__main__": unittest.main()
