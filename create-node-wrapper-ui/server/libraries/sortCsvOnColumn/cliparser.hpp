#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>

namespace cli {
	struct Parser {
		std::unordered_map<std::string, std::string> longToAlias;
		std::unordered_map<std::string, std::string> value;
		std::unordered_map<std::string, std::string> description;
		std::unordered_set<std::string> is_required;
		std::unordered_set<std::string> is_unset;
		std::unordered_set<std::string> is_bool;
		std::vector<std::string> order;

		void set_required(std::string smallKey, std::string longkey, std::string desc) {
			is_required.insert(smallKey);
			is_unset.insert(smallKey);
			set_optional(smallKey, longkey, "", desc);
		}

		void set_bool(std::string smallKey, std::string longkey, std::string desc) {
			is_bool.insert(smallKey);
			set_optional(smallKey, longkey, "", desc);
		}

		void set_optional(std::string smallKey, std::string longkey, std::string defValue, std::string desc) {
			if (description.find(smallKey) != description.end()) {
				throw std::invalid_argument(smallKey + " is already set");
			}
			longToAlias[longkey] = smallKey;
			value[smallKey] = defValue;
			description[smallKey] = desc;
			order.push_back(longkey);
		}

		void help() {
			for (auto it = order.begin(); it != order.end(); it++) {
				auto longkey = *it;
				auto smallKey = longToAlias[longkey];
				auto desc = description[smallKey];
				bool is_req = is_required.find(smallKey) != is_required.end();
				bool is_b = is_bool.find(smallKey) != is_bool.end();

				std::cout << "\t-" << smallKey << ", --" << longkey;
				if (is_b) {
					std::cout << " (flag)\n\t\t" << description[smallKey] << "\n\n";
				} else {
					std::cout << " <value> ";
					if (is_req) std::cout << "(required)";
					std::cout << "\n\t\t" << description[smallKey] << "\n\n";
				}
			}
		}

		template<class T>
		T get(std::string key) {
			if (longToAlias.find(key) != longToAlias.end()) key = longToAlias[key];
			return value[key];
		}

		bool parse(int argc, char** argv) {
			for (int i = 1; i < argc; i++) {
				const char* cur = argv[i];
				if (std::string(cur) == "-help" || std::string(cur) == "--help") {
					help();
					return false;
				}
				std::string key = "";
				if (cur[0] == '-' && cur[1] == '-') {
					if (longToAlias.find(cur + 2) != longToAlias.end()) key = longToAlias[cur + 2];
				} else if (cur[0] == '-') {
					if (description.find(cur + 1) != description.end()) key = cur + 1;
				}
				if (!key.size()) throw std::invalid_argument(std::string("invalid argument ") + cur);

				if (is_unset.find(key) != is_unset.end()) is_unset.erase(key);
				bool is_b = is_bool.find(key) != is_bool.end();
				if (is_b) {
					value[key] = "1";
				} else {
					value[key] = argv[++i];
					if (argv[i] == 0) throw std::invalid_argument(std::string("missing value for ") + key);
				}
			}
			if (is_unset.size()) {
				throw std::invalid_argument(std::string("argument ") + *(is_unset.begin()) + " is required");
			}
			return true;
		}
	};

	template<>
	bool Parser::get<bool>(std::string key) {
		std::string i = this->get<std::string>(key);
		return i.size();
	}
}
